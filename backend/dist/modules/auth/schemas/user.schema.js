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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = exports.LEVELS = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.LEVELS = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C2'];
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'user', enum: ['user', 'admin'] }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'A1', enum: exports.LEVELS }),
    __metadata("design:type", String)
], User.prototype, "currentLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "xp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "streak", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "lastActivityDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            grammarCompleted: { type: Number, default: 0 },
            grammarAccuracy: { type: Number, default: 0 },
            vocabularyLearned: { type: Number, default: 0 },
            readingCompleted: { type: Number, default: 0 },
            writingSubmitted: { type: Number, default: 0 },
            listeningCompleted: { type: Number, default: 0 },
            quizCompleted: { type: Number, default: 0 },
            totalSessionTime: { type: Number, default: 0 },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], User.prototype, "stats", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                level: String,
                attemptNumber: Number,
                score: Number,
                passed: Boolean,
                takenAt: Date,
                breakdown: {
                    grammar: Number,
                    vocabulary: Number,
                    reading: Number,
                    listening: Number,
                },
            },
        ],
        default: [],
    }),
    __metadata("design:type", typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object)
], User.prototype, "levelTests", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map