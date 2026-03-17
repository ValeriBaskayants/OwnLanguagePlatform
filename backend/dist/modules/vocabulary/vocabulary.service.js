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
exports.VocabularyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vocabulary_schema_1 = require("./schemas/vocabulary.schema");
const user_vocabulary_progress_schema_1 = require("./schemas/user-vocabulary-progress.schema");
function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}
function updateSM2(card, quality) {
    if (quality < 1) {
        card.repetitions = 0;
        card.interval = 1;
    }
    else {
        if (card.repetitions === 0)
            card.interval = 1;
        else if (card.repetitions === 1)
            card.interval = 6;
        else
            card.interval = Math.round(card.interval * card.easinessFactor);
        card.repetitions++;
    }
    card.easinessFactor = Math.max(1.3, card.easinessFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    card.nextReviewDate = addDays(new Date(), card.interval);
    card.status = card.repetitions >= 3 ? 'mastered' : 'learning';
    card.lastReviewedAt = new Date();
    return card;
}
let VocabularyService = class VocabularyService {
    constructor(vocabModel, progressModel) {
        this.vocabModel = vocabModel;
        this.progressModel = progressModel;
    }
    async findAll(query) {
        const filter = {};
        if (query.level)
            filter.level = query.level;
        if (query.type)
            filter.type = query.type;
        if (query.search)
            filter.word = { $regex: query.search, $options: 'i' };
        return this.vocabModel.find(filter).limit(query.limit || 200).lean();
    }
    async getFlashcards(userId, level, limit = 20) {
        const now = new Date();
        const dueProgress = await this.progressModel
            .find({ userId, nextReviewDate: { $lte: now } })
            .populate('wordId')
            .limit(limit)
            .lean();
        if (dueProgress.length >= limit) {
            return dueProgress.map((p) => ({ progress: p, word: p.wordId }));
        }
        const learnedWordIds = await this.progressModel.distinct('wordId', { userId });
        const vocabFilter = { _id: { $nin: learnedWordIds } };
        if (level)
            vocabFilter.level = level;
        const newWords = await this.vocabModel
            .find(vocabFilter)
            .limit(limit - dueProgress.length)
            .lean();
        for (const word of newWords) {
            await this.progressModel.findOneAndUpdate({ userId, wordId: word._id }, {
                userId, wordId: word._id,
                easinessFactor: 2.5, interval: 1, repetitions: 0,
                nextReviewDate: now, status: 'new', lastReviewedAt: null,
            }, { upsert: true, new: true });
        }
        return [
            ...dueProgress.map((p) => ({ progress: p, word: p.wordId })),
            ...newWords.map(w => ({ progress: null, word: w })),
        ];
    }
    async reviewWord(userId, wordId, quality) {
        let progress = await this.progressModel.findOne({ userId, wordId });
        if (!progress) {
            progress = new this.progressModel({
                userId, wordId, easinessFactor: 2.5, interval: 1, repetitions: 0,
                nextReviewDate: new Date(), status: 'new',
            });
        }
        const updated = updateSM2(progress, quality);
        await this.progressModel.findOneAndUpdate({ userId, wordId }, updated, { upsert: true });
        return { status: updated.status, nextReviewDate: updated.nextReviewDate };
    }
    async getUserProgress(userId) {
        const total = await this.vocabModel.countDocuments();
        const learned = await this.progressModel.countDocuments({ userId, status: { $in: ['learning', 'review', 'mastered'] } });
        const mastered = await this.progressModel.countDocuments({ userId, status: 'mastered' });
        const dueToday = await this.progressModel.countDocuments({ userId, nextReviewDate: { $lte: new Date() } });
        return { total, learned, mastered, dueToday };
    }
    async bulkCreate(words) {
        let inserted = 0, skipped = 0, errors = 0;
        for (const word of words) {
            try {
                const exists = await this.vocabModel.findOne({ word: word.word });
                if (exists) {
                    skipped++;
                    continue;
                }
                await this.vocabModel.create(word);
                inserted++;
            }
            catch {
                errors++;
            }
        }
        return { inserted, skipped, errors };
    }
};
exports.VocabularyService = VocabularyService;
exports.VocabularyService = VocabularyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vocabulary_schema_1.Vocabulary.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_vocabulary_progress_schema_1.UserVocabularyProgress.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], VocabularyService);
//# sourceMappingURL=vocabulary.service.js.map