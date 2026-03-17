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
exports.GrammarRuleSchema = exports.GrammarRule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let GrammarRule = class GrammarRule {
};
exports.GrammarRule = GrammarRule;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GrammarRule.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], GrammarRule.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GrammarRule.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GrammarRule.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GrammarRule.prototype, "coreConcept", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GrammarRule.prototype, "structure", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: String,
                explanation: String,
                examples: [{ sentence: String, translation: String }],
            }],
        default: [],
    }),
    __metadata("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], GrammarRule.prototype, "usages", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: String,
                content: String,
                examples: [{ sentence: String, translation: String }],
            }],
        default: [],
    }),
    __metadata("design:type", typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object)
], GrammarRule.prototype, "sections", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                compareWith: String,
                explanation: String,
                examples: [{ sentence: String, translation: String }],
            }],
        default: [],
    }),
    __metadata("design:type", typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object)
], GrammarRule.prototype, "comparisons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], GrammarRule.prototype, "commonMistakes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], GrammarRule.prototype, "signalWords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], GrammarRule.prototype, "relatedTopics", void 0);
exports.GrammarRule = GrammarRule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GrammarRule);
exports.GrammarRuleSchema = mongoose_1.SchemaFactory.createForClass(GrammarRule);
exports.GrammarRuleSchema.index({ level: 1 });
//# sourceMappingURL=grammar-rule.schema.js.map