"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const level_progress_schema_1 = require("./schemas/level-progress.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const daily_activity_schema_1 = require("../daily-activity/schemas/daily-activity.schema");
const session_schema_1 = require("../sessions/schemas/session.schema");
const progress_service_1 = require("./progress.service");
const progress_controller_1 = require("./progress.controller");
let ProgressModule = class ProgressModule {
};
exports.ProgressModule = ProgressModule;
exports.ProgressModule = ProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: level_progress_schema_1.LevelProgress.name, schema: level_progress_schema_1.LevelProgressSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: daily_activity_schema_1.DailyActivity.name, schema: daily_activity_schema_1.DailyActivitySchema },
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
            ]),
        ],
        controllers: [progress_controller_1.ProgressController],
        providers: [progress_service_1.ProgressService],
        exports: [progress_service_1.ProgressService],
    })
], ProgressModule);
//# sourceMappingURL=progress.module.js.map