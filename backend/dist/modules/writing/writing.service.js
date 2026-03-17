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
exports.WritingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const writing_schema_1 = require("./schemas/writing.schema");
async function analyzeWithLanguageTool(text, minWords) {
    try {
        const res = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ text, language: 'en-US', enabledOnly: 'false' }).toString(),
        });
        const data = await res.json();
        const errors = data.matches || [];
        const errorCount = errors.length;
        const words = text.trim().split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const grammarScore = Math.max(0, 100 - errorCount * 8);
        const taskScore = words >= minWords ? 100 : Math.round((words / minWords) * 100);
        const avgWordsPerSentence = words / Math.max(sentences, 1);
        const coherenceScore = avgWordsPerSentence >= 5 && avgWordsPerSentence <= 20 ? 90 : 60;
        const overallScore = Math.round((grammarScore + taskScore + coherenceScore) / 3);
        return {
            overallScore, grammarScore, taskScore, coherenceScore,
            errorCount, wordCount: words,
            errors: errors.map((e) => ({
                message: e.message,
                context: e.context?.text || '',
                offset: e.offset,
                length: e.length,
                replacements: (e.replacements || []).slice(0, 3).map((r) => r.value),
            })),
        };
    }
    catch {
        return { overallScore: 70, grammarScore: 70, taskScore: 70, coherenceScore: 70, errorCount: 0, wordCount: text.split(/\s+/).length, errors: [] };
    }
}
let WritingService = class WritingService {
    constructor(promptModel, submissionModel) {
        this.promptModel = promptModel;
        this.submissionModel = submissionModel;
    }
    async getPrompts(level) {
        const filter = {};
        if (level)
            filter.level = level;
        return this.promptModel.find(filter).lean();
    }
    async getPromptById(id) {
        const p = await this.promptModel.findById(id).lean();
        if (!p)
            throw new common_1.NotFoundException('Prompt not found');
        return p;
    }
    async submit(userId, promptId, text) {
        const prompt = await this.promptModel.findById(promptId);
        if (!prompt)
            throw new common_1.NotFoundException('Prompt not found');
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount < prompt.minWords * 0.5)
            throw new common_1.BadRequestException(`Text too short (min ${prompt.minWords} words)`);
        const submission = await this.submissionModel.create({
            userId, promptId, text, status: 'pending', submittedAt: new Date(),
        });
        analyzeWithLanguageTool(text, prompt.minWords).then(async (analysis) => {
            await this.submissionModel.findByIdAndUpdate(submission._id, { analysis, status: 'analyzed' });
        }).catch(async () => {
            await this.submissionModel.findByIdAndUpdate(submission._id, { status: 'error' });
        });
        return { submissionId: submission._id, status: 'pending' };
    }
    async getSubmission(id, userId) {
        const s = await this.submissionModel.findOne({ _id: id, userId }).lean();
        if (!s)
            throw new common_1.NotFoundException('Submission not found');
        return s;
    }
    async getSubmissions(userId, promptId) {
        const filter = { userId };
        if (promptId)
            filter.promptId = promptId;
        return this.submissionModel.find(filter).sort({ submittedAt: -1 }).populate('promptId').lean();
    }
    async bulkCreatePrompts(prompts) {
        let inserted = 0, skipped = 0, errors = 0;
        for (const p of prompts) {
            try {
                await this.promptModel.create(p);
                inserted++;
            }
            catch {
                errors++;
            }
        }
        return { inserted, skipped, errors };
    }
};
exports.WritingService = WritingService;
exports.WritingService = WritingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(writing_schema_1.WritingPrompt.name)),
    __param(1, (0, mongoose_1.InjectModel)(writing_schema_1.WritingSubmission.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], WritingService);
//# sourceMappingURL=writing.service.js.map