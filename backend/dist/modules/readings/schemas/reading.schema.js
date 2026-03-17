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
exports.ReadingSchema = exports.Reading = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Reading = class Reading {
};
exports.Reading = Reading;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Reading.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reading.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reading.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reading.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Reading.prototype, "wordCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 3 }),
    __metadata("design:type", Number)
], Reading.prototype, "estimatedMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                question: String,
                options: [String],
                correctIndex: Number,
                explanation: String,
                type: String,
            },
        ],
        default: [],
    }),
    __metadata("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], Reading.prototype, "questions", void 0);
exports.Reading = Reading = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reading);
exports.ReadingSchema = mongoose_1.SchemaFactory.createForClass(Reading);
exports.ReadingSchema.index({ level: 1, topic: 1 });
//# sourceMappingURL=reading.schema.js.map