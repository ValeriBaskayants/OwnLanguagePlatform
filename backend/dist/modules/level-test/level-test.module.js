"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelTestModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const level_progress_schema_1 = require("../progress/schemas/level-progress.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const exercise_schema_1 = require("../exercises/schemas/exercise.schema");
const multiple_choice_schema_1 = require("../multiple-choice/schemas/multiple-choice.schema");
const reading_schema_1 = require("../readings/schemas/reading.schema");
const listening_schema_1 = require("../listening/schemas/listening.schema");
const level_test_service_1 = require("./level-test.service");
const level_test_controller_1 = require("./level-test.controller");
const progress_module_1 = require("../progress/progress.module");
let LevelTestModule = class LevelTestModule {
};
exports.LevelTestModule = LevelTestModule;
exports.LevelTestModule = LevelTestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: level_progress_schema_1.LevelProgress.name, schema: level_progress_schema_1.LevelProgressSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: exercise_schema_1.Exercise.name, schema: exercise_schema_1.ExerciseSchema },
                { name: multiple_choice_schema_1.MultipleChoice.name, schema: multiple_choice_schema_1.MultipleChoiceSchema },
                { name: reading_schema_1.Reading.name, schema: reading_schema_1.ReadingSchema },
                { name: listening_schema_1.Listening.name, schema: listening_schema_1.ListeningSchema },
            ]),
            progress_module_1.ProgressModule,
        ],
        controllers: [level_test_controller_1.LevelTestController],
        providers: [level_test_service_1.LevelTestService],
    })
], LevelTestModule);
//# sourceMappingURL=level-test.module.js.map