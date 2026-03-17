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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../auth/schemas/user.schema");
const exercises_service_1 = require("../exercises/exercises.service");
const grammar_rules_service_1 = require("../grammar-rules/grammar-rules.service");
const vocabulary_service_1 = require("../vocabulary/vocabulary.service");
const readings_service_1 = require("../readings/readings.service");
const multiple_choice_service_1 = require("../multiple-choice/multiple-choice.service");
const writing_service_1 = require("../writing/writing.service");
const listening_service_1 = require("../listening/listening.service");
let AdminService = class AdminService {
    constructor(userModel, exercisesService, grammarRulesService, vocabularyService, readingsService, mcService, writingService, listeningService) {
        this.userModel = userModel;
        this.exercisesService = exercisesService;
        this.grammarRulesService = grammarRulesService;
        this.vocabularyService = vocabularyService;
        this.readingsService = readingsService;
        this.mcService = mcService;
        this.writingService = writingService;
        this.listeningService = listeningService;
    }
    async importExercises(data) {
        return this.exercisesService.bulkCreate(data.exercises || []);
    }
    async importGrammarRules(data) {
        return this.grammarRulesService.bulkCreate(data.grammarRules || []);
    }
    async importVocabulary(data) {
        return this.vocabularyService.bulkCreate(data.vocabulary || []);
    }
    async importReadings(data) {
        return this.readingsService.bulkCreate(data.readings || []);
    }
    async importMultipleChoice(data) {
        return this.mcService.bulkCreate(data.multipleChoice || []);
    }
    async importWritingPrompts(data) {
        return this.writingService.bulkCreatePrompts(data.writingPrompts || []);
    }
    async importListening(data) {
        return this.listeningService.bulkCreate(data.listening || []);
    }
    async getStats() {
        const users = await this.userModel.find().select('-password').lean();
        return {
            totalUsers: users.length,
            users: users.map(u => ({
                email: u.email,
                role: u.role,
                currentLevel: u.currentLevel,
                xp: u.xp,
                streak: u.streak,
                stats: u.stats,
            })),
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, exercises_service_1.ExercisesService,
        grammar_rules_service_1.GrammarRulesService,
        vocabulary_service_1.VocabularyService,
        readings_service_1.ReadingsService,
        multiple_choice_service_1.MultipleChoiceService,
        writing_service_1.WritingService,
        listening_service_1.ListeningService])
], AdminService);
//# sourceMappingURL=admin.service.js.map