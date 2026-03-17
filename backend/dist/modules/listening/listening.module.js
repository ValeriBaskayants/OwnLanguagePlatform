"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListeningModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const listening_schema_1 = require("./schemas/listening.schema");
const listening_service_1 = require("./listening.service");
const listening_controller_1 = require("./listening.controller");
let ListeningModule = class ListeningModule {
};
exports.ListeningModule = ListeningModule;
exports.ListeningModule = ListeningModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: listening_schema_1.Listening.name, schema: listening_schema_1.ListeningSchema }])],
        controllers: [listening_controller_1.ListeningController],
        providers: [listening_service_1.ListeningService],
        exports: [listening_service_1.ListeningService],
    })
], ListeningModule);
//# sourceMappingURL=listening.module.js.map