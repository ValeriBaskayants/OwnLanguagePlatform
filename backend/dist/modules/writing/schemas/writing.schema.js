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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WritingSubmissionSchema = exports.WritingSubmission = exports.WritingPromptSchema = exports.WritingPrompt = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WritingPrompt = class WritingPrompt {
};
exports.WritingPrompt = WritingPrompt;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WritingPrompt.prototype, "prompt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WritingPrompt.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['sentence', 'paragraph', 'essay'], default: 'paragraph' }),
    __metadata("design:type", String)
], WritingPrompt.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 50 }),
    __metadata("design:type", Number)
], WritingPrompt.prototype, "minWords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 200 }),
    __metadata("design:type", Number)
], WritingPrompt.prototype, "maxWords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], WritingPrompt.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], WritingPrompt.prototype, "instructions", void 0);
exports.WritingPrompt = WritingPrompt = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WritingPrompt);
exports.WritingPromptSchema = mongoose_1.SchemaFactory.createForClass(WritingPrompt);
exports.WritingPromptSchema.index({ level: 1 });
let WritingSubmission = class WritingSubmission {
};
exports.WritingSubmission = WritingSubmission;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Schema !== "undefined" && (_a = mongoose_2.Schema.Types) !== void 0 && _a.ObjectId) === "function" ? _b : Object)
], WritingSubmission.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'WritingPrompt', required: true }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Schema !== "undefined" && (_c = mongoose_2.Schema.Types) !== void 0 && _c.ObjectId) === "function" ? _d : Object)
], WritingSubmission.prototype, "promptId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WritingSubmission.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            overallScore: Number,
            grammarScore: Number,
            taskScore: Number,
            coherenceScore: Number,
            wordCount: Number,
            errorCount: Number,
            errors: [
                {
                    message: String,
                    context: String,
                    offset: Number,
                    length: Number,
                    replacements: [String],
                },
            ],
        },
        default: null,
    }),
    __metadata("design:type", Object)
], WritingSubmission.prototype, "analysis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'analyzed', 'error'], default: 'pending' }),
    __metadata("design:type", String)
], WritingSubmission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], WritingSubmission.prototype, "submittedAt", void 0);
exports.WritingSubmission = WritingSubmission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WritingSubmission);
exports.WritingSubmissionSchema = mongoose_1.SchemaFactory.createForClass(WritingSubmission);
exports.WritingSubmissionSchema.index({ userId: 1, promptId: 1 });
//# sourceMappingURL=writing.schema.js.map