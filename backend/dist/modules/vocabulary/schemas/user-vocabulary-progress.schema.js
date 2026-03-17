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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVocabularyProgressSchema = exports.UserVocabularyProgress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserVocabularyProgress = class UserVocabularyProgress {
};
exports.UserVocabularyProgress = UserVocabularyProgress;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Schema !== "undefined" && (_a = mongoose_2.Schema.Types) !== void 0 && _a.ObjectId) === "function" ? _b : Object)
], UserVocabularyProgress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Vocabulary', required: true }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Schema !== "undefined" && (_c = mongoose_2.Schema.Types) !== void 0 && _c.ObjectId) === "function" ? _d : Object)
], UserVocabularyProgress.prototype, "wordId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 2.5 }),
    __metadata("design:type", Number)
], UserVocabularyProgress.prototype, "easinessFactor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], UserVocabularyProgress.prototype, "interval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserVocabularyProgress.prototype, "repetitions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], UserVocabularyProgress.prototype, "nextReviewDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['new', 'learning', 'review', 'mastered'], default: 'new' }),
    __metadata("design:type", String)
], UserVocabularyProgress.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], UserVocabularyProgress.prototype, "lastReviewedAt", void 0);
exports.UserVocabularyProgress = UserVocabularyProgress = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserVocabularyProgress);
exports.UserVocabularyProgressSchema = mongoose_1.SchemaFactory.createForClass(UserVocabularyProgress);
exports.UserVocabularyProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });
exports.UserVocabularyProgressSchema.index({ userId: 1, nextReviewDate: 1 });
//# sourceMappingURL=user-vocabulary-progress.schema.js.map