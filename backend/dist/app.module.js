"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const configuration_1 = require("./config/configuration");
const auth_module_1 = require("./modules/auth/auth.module");
const exercises_module_1 = require("./modules/exercises/exercises.module");
const grammar_rules_module_1 = require("./modules/grammar-rules/grammar-rules.module");
const vocabulary_module_1 = require("./modules/vocabulary/vocabulary.module");
const readings_module_1 = require("./modules/readings/readings.module");
const multiple_choice_module_1 = require("./modules/multiple-choice/multiple-choice.module");
const listening_module_1 = require("./modules/listening/listening.module");
const writing_module_1 = require("./modules/writing/writing.module");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const mistakes_module_1 = require("./modules/mistakes/mistakes.module");
const progress_module_1 = require("./modules/progress/progress.module");
const level_test_module_1 = require("./modules/level-test/level-test.module");
const bookmarks_module_1 = require("./modules/bookmarks/bookmarks.module");
const admin_module_1 = require("./modules/admin/admin.module");
const daily_activity_module_1 = require("./modules/daily-activity/daily-activity.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ load: [configuration_1.default], isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('mongoUri'),
                }),
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    throttlers: [{
                            ttl: (config.get('throttleTtl') ?? 60) * 1000,
                            limit: config.get('throttleLimit') ?? 120,
                        }],
                }),
            }),
            auth_module_1.AuthModule,
            exercises_module_1.ExercisesModule,
            grammar_rules_module_1.GrammarRulesModule,
            vocabulary_module_1.VocabularyModule,
            readings_module_1.ReadingsModule,
            multiple_choice_module_1.MultipleChoiceModule,
            listening_module_1.ListeningModule,
            writing_module_1.WritingModule,
            sessions_module_1.SessionsModule,
            mistakes_module_1.MistakesModule,
            progress_module_1.ProgressModule,
            level_test_module_1.LevelTestModule,
            bookmarks_module_1.BookmarksModule,
            admin_module_1.AdminModule,
            daily_activity_module_1.DailyActivityModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map