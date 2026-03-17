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
exports.MistakeSchema = exports.Mistake = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Mistake = class Mistake {
};
exports.Mistake = Mistake;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Schema !== "undefined" && (_a = mongoose_2.Schema.Types) !== void 0 && _a.ObjectId) === "function" ? _b : Object)
], Mistake.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Schema !== "undefined" && (_c = mongoose_2.Schema.Types) !== void 0 && _c.ObjectId) === "function" ? _d : Object)
], Mistake.prototype, "itemId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['grammar', 'quiz', 'vocabulary', 'listening'], required: true }),
    __metadata("design:type", String)
], Mistake.prototype, "itemType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Mistake.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Mistake.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'easy' }),
    __metadata("design:type", String)
], Mistake.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ userAnswer: String, correctAnswer: String, occurredAt: Date }],
        default: [],
    }),
    __metadata("design:type", typeof (_e = typeof Array !== "undefined" && Array) === "function" ? _e : Object)
], Mistake.prototype, "wrongAnswers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Mistake.prototype, "occurrenceCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Mistake.prototype, "lastAttemptAt", void 0);
exports.Mistake = Mistake = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Mistake);
exports.MistakeSchema = mongoose_1.SchemaFactory.createForClass(Mistake);
exports.MistakeSchema.index({ userId: 1, itemId: 1 }, { unique: true });
exports.MistakeSchema.index({ userId: 1, topic: 1 });
//# sourceMappingURL=mistake.schema.js.map