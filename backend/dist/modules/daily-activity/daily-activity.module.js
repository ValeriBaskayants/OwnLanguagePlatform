"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyActivityModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const daily_activity_schema_1 = require("./schemas/daily-activity.schema");
let DailyActivityModule = class DailyActivityModule {
};
exports.DailyActivityModule = DailyActivityModule;
exports.DailyActivityModule = DailyActivityModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: daily_activity_schema_1.DailyActivity.name, schema: daily_activity_schema_1.DailyActivitySchema }])],
        exports: [mongoose_1.MongooseModule],
    })
], DailyActivityModule);
//# sourceMappingURL=daily-activity.module.js.map