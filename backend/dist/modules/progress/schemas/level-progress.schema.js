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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelProgressSchema = exports.LevelProgress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LevelProgress = class LevelProgress {
};
exports.LevelProgress = LevelProgress;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Schema !== "undefined" && (_a = mongoose_2.Schema.Types) !== void 0 && _a.ObjectId) === "function" ? _b : Object)
], LevelProgress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LevelProgress.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LevelProgress.prototype, "targetLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            grammar: {
                required: { type: Number, default: 40 },
                completed: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 },
            },
            vocabulary: {
                required: { type: Number, default: 50 },
                learned: { type: Number, default: 0 },
            },
            reading: {
                required: { type: Number, default: 5 },
                completed: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 },
            },
            writing: {
                required: { type: Number, default: 0 },
                completed: { type: Number, default: 0 },
                avgScore: { type: Number, default: 0 },
            },
            listening: {
                required: { type: Number, default: 0 },
                completed: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 },
            },
            quiz: {
                required: { type: Number, default: 20 },
                completed: { type: Number, default: 0 },
                accuracy: { type: Number, default: 0 },
            },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], LevelProgress.prototype, "requirements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], LevelProgress.prototype, "isReadyForTest", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], LevelProgress.prototype, "testUnlockedAt", void 0);
exports.LevelProgress = LevelProgress = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LevelProgress);
exports.LevelProgressSchema = mongoose_1.SchemaFactory.createForClass(LevelProgress);
exports.LevelProgressSchema.index({ userId: 1, level: 1 }, { unique: true });
//# sourceMappingURL=level-progress.schema.js.map