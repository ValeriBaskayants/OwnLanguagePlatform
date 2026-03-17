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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("./schemas/session.schema");
const mistake_schema_1 = require("../mistakes/schemas/mistake.schema");
const progress_service_1 = require("../progress/progress.service");
const XP_TABLE = {
    grammar: 5, quiz: 5, flashcard: 3, reading: 15, writing: 10, listening: 8, level_test: 500,
};
let SessionsService = class SessionsService {
    constructor(sessionModel, mistakeModel, progressService) {
        this.sessionModel = sessionModel;
        this.mistakeModel = mistakeModel;
        this.progressService = progressService;
    }
    async createSession(userId, body) {
        const { type, level, answers, durationMs, writingScore, vocabLearned } = body;
        const correctCount = answers.filter(a => a.isCorrect).length;
        const totalItems = answers.length;
        const score = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;
        let xpEarned = correctCount * (XP_TABLE[type] || 5);
        if (type === 'grammar' && score === 100)
            xpEarned += 20;
        if (type === 'reading' && score >= 80)
            xpEarned += 0;
        if (type === 'writing' && writingScore && writingScore >= 80)
            xpEarned += 25;
        if (type === 'level_test')
            xpEarned = 500;
        const session = await this.sessionModel.create({
            userId, type, level,
            answers: answers.map(a => ({
                itemId: a.itemId, userAnswer: a.userAnswer,
                correctAnswer: a.correctAnswer, isCorrect: a.isCorrect, timeSpentMs: a.timeSpentMs,
            })),
            score, totalItems, correctCount, xpEarned, durationMs,
            startedAt: new Date(Date.now() - durationMs), completedAt: new Date(),
        });
        for (const a of answers) {
            if (!a.isCorrect && a.itemId) {
                await this.mistakeModel.findOneAndUpdate({ userId, itemId: a.itemId }, {
                    $setOnInsert: { userId, itemId: a.itemId, itemType: type, topic: a.topic || 'Unknown', level, difficulty: a.difficulty || 'easy' },
                    $push: { wrongAnswers: { userAnswer: a.userAnswer, correctAnswer: a.correctAnswer, occurredAt: new Date() } },
                    $inc: { occurrenceCount: 1 },
                    $set: { lastAttemptAt: new Date() },
                }, { upsert: true });
            }
        }
        const progressResult = await this.progressService.updateAfterSession(userId, type, score, correctCount, totalItems, xpEarned, durationMs, writingScore, vocabLearned);
        return { session, xpEarned, score, correctCount, totalItems, progressResult };
    }
    async getHistory(userId) {
        return this.sessionModel.find({ userId }).sort({ startedAt: -1 }).limit(50).lean();
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(1, (0, mongoose_1.InjectModel)(mistake_schema_1.Mistake.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, progress_service_1.ProgressService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map