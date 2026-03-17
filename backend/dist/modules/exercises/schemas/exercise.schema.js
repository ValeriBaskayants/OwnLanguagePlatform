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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseSchema = exports.Exercise = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Exercise = class Exercise {
};
exports.Exercise = Exercise;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Exercise.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Exercise.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['easy', 'medium', 'hard'], default: 'easy' }),
    __metadata("design:type", String)
], Exercise.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Exercise.prototype, "sentence", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ position: Number, answer: String, hint: String }],
        required: true,
    }),
    __metadata("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], Exercise.prototype, "blanks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Exercise.prototype, "explanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Exercise.prototype, "tags", void 0);
exports.Exercise = Exercise = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Exercise);
exports.ExerciseSchema = mongoose_1.SchemaFactory.createForClass(Exercise);
exports.ExerciseSchema.index({ level: 1, difficulty: 1 });
exports.ExerciseSchema.index({ topic: 1 });
//# sourceMappingURL=exercise.schema.js.map