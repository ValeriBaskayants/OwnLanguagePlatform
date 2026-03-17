"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../auth/schemas/user.schema");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const exercises_module_1 = require("../exercises/exercises.module");
const grammar_rules_module_1 = require("../grammar-rules/grammar-rules.module");
const vocabulary_module_1 = require("../vocabulary/vocabulary.module");
const readings_module_1 = require("../readings/readings.module");
const multiple_choice_module_1 = require("../multiple-choice/multiple-choice.module");
const writing_module_1 = require("../writing/writing.module");
const listening_module_1 = require("../listening/listening.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            exercises_module_1.ExercisesModule, grammar_rules_module_1.GrammarRulesModule, vocabulary_module_1.VocabularyModule,
            readings_module_1.ReadingsModule, multiple_choice_module_1.MultipleChoiceModule, writing_module_1.WritingModule, listening_module_1.ListeningModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map