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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabularySchema = exports.Vocabulary = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Vocabulary = class Vocabulary {
};
exports.Vocabulary = Vocabulary;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Vocabulary.prototype, "word", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vocabulary.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['noun', 'verb', 'adjective', 'adverb', 'phrase'], default: 'noun' }),
    __metadata("design:type", String)
], Vocabulary.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Vocabulary.prototype, "pronunciation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vocabulary.prototype, "definition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Vocabulary.prototype, "definitionRu", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Vocabulary.prototype, "examples", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Vocabulary.prototype, "synonyms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Vocabulary.prototype, "antonyms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Vocabulary.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            base: String,
            past: String,
            pastParticiple: String,
            thirdPerson: String,
            presentParticiple: String,
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Vocabulary.prototype, "forms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Vocabulary.prototype, "isIrregularVerb", void 0);
exports.Vocabulary = Vocabulary = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Vocabulary);
exports.VocabularySchema = mongoose_1.SchemaFactory.createForClass(Vocabulary);
exports.VocabularySchema.index({ level: 1, type: 1 });
exports.VocabularySchema.index({ word: 'text' });
//# sourceMappingURL=vocabulary.schema.js.map