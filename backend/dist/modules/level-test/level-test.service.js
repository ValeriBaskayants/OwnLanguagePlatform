"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelTestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const level_progress_schema_1 = require("../progress/schemas/level-progress.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const exercise_schema_1 = require("../exercises/schemas/exercise.schema");
const multiple_choice_schema_1 = require("../multiple-choice/schemas/multiple-choice.schema");
const reading_schema_1 = require("../readings/schemas/reading.schema");
const listening_schema_1 = require("../listening/schemas/listening.schema");
const progress_service_1 = require("../progress/progress.service");
let LevelTestService = class LevelTestService {
    constructor(progressModel, userModel, exerciseModel, mcModel, readingModel, listeningModel, progressService) {
        this.progressModel = progressModel;
        this.userModel = userModel;
        this.exerciseModel = exerciseModel;
        this.mcModel = mcModel;
        this.readingModel = readingModel;
        this.listeningModel = listeningModel;
        this.progressService = progressService;
    }
    async getQuestions(userId) {
        const user = await this.userModel.findById(userId).lean();
        if (!user)
            throw new common_1.ForbiddenException('User not found');
        const progress = await this.progressModel.findOne({ userId, level: user.currentLevel }).lean();
        if (!progress?.isReadyForTest) {
            throw new common_1.ForbiddenException('Complete all requirements first');
        }
        const lastAttempt = user.levelTests?.filter(t => t.level === user.currentLevel && !t.passed).slice(-1)[0];
        if (lastAttempt) {
            const hoursSince = (Date.now() - new Date(lastAttempt.takenAt).getTime()) / 3600000;
            if (hoursSince < 24) {
                const hoursLeft = Math.ceil(24 - hoursSince);
                throw new common_1.ForbiddenException(`Wait ${hoursLeft} more hour(s) before retrying`);
            }
        }
        const level = user.currentLevel;
        const [exercises, mcQuestions, readings, listeningItems] = await Promise.all([
            this.exerciseModel.aggregate([{ $match: { level } }, { $sample: { size: 20 } }]),
            this.mcModel.aggregate([{ $match: { level } }, { $sample: { size: 15 } }]),
            this.readingModel.aggregate([{ $match: { level } }, { $sample: { size: 2 } }]),
            this.listeningModel.aggregate([{ $match: { level } }, { $sample: { size: 5 } }]),
        ]);
        const readingQs = [];
        for (const r of readings) {
            if (readingQs.length >= 10)
                break;
            for (const q of (r.questions || []).slice(0, 5)) {
                readingQs.push({ ...q, readingId: r._id, readingTitle: r.title, readingContent: r.content, type: 'reading' });
            }
        }
        return {
            questions: {
                grammar: exercises.map(e => ({ ...e, questionType: 'grammar' })),
                vocabulary: mcQuestions.map(q => ({ ...q, questionType: 'vocabulary' })),
                reading: readingQs.slice(0, 10),
                listening: listeningItems.map(l => ({ ...l, questionType: 'listening' })),
            },
            timeLimit: 45 * 60,
            startedAt: new Date().toISOString(),
        };
    }
    async submitTest(userId, body) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.ForbiddenException('User not found');
        const elapsed = (Date.now() - new Date(body.startedAt).getTime()) / 1000;
        if (elapsed > 45 * 60 + 30)
            throw new common_1.BadRequestException('Time limit exceeded');
        const bySection = { grammar: [], vocabulary: [], reading: [], listening: [] };
        for (const a of body.answers) {
            const sec = a.sectionType;
            if (bySection[sec])
                bySection[sec].push(a);
        }
        const calcScore = (arr) => arr.length ? Math.round(arr.filter(a => a.isCorrect).length / arr.length * 100) : 0;
        const breakdown = {
            grammar: calcScore(bySection.grammar),
            vocabulary: calcScore(bySection.vocabulary),
            reading: calcScore(bySection.reading),
            listening: calcScore(bySection.listening),
        };
        const totalCorrect = body.answers.filter(a => a.isCorrect).length;
        const score = Math.round(totalCorrect / Math.max(body.answers.length, 1) * 100);
        const passed = score >= 85;
        const attemptNumber = (user.levelTests?.filter(t => t.level === user.currentLevel).length || 0) + 1;
        user.levelTests = user.levelTests || [];
        user.levelTests.push({ level: user.currentLevel, attemptNumber, score, passed, takenAt: new Date(), breakdown });
        if (passed) {
            const newLevel = { A1: 'A1+', 'A1+': 'A2', A2: 'A2+', 'A2+': 'B1', B1: 'B1+', 'B1+': 'B2', B2: 'B2+', 'B2+': 'C1', C1: 'C2' }[user.currentLevel];
            if (newLevel) {
                const oldLevel = user.currentLevel;
                user.currentLevel = newLevel;
                await user.save();
                await this.progressService.promoteUser(userId, newLevel);
                user.xp += 500;
                await user.save();
                return { score, passed, breakdown, newLevel, oldLevel, xpEarned: 500 };
            }
        }
        else {
            const failCount = user.levelTests.filter(t => t.level === user.currentLevel && !t.passed).length;
            await user.save();
            return { score, passed, breakdown, failCount, cooldownHours: 24, xpEarned: 0 };
        }
        await user.save();
        return { score, passed, breakdown, xpEarned: 0 };
    }
};
exports.LevelTestService = LevelTestService;
exports.LevelTestService = LevelTestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(level_progress_schema_1.LevelProgress.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(exercise_schema_1.Exercise.name)),
    __param(3, (0, mongoose_1.InjectModel)(multiple_choice_schema_1.MultipleChoice.name)),
    __param(4, (0, mongoose_1.InjectModel)(reading_schema_1.Reading.name)),
    __param(5, (0, mongoose_1.InjectModel)(listening_schema_1.Listening.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, progress_service_1.ProgressService])
], LevelTestService);
//# sourceMappingURL=level-test.service.js.map