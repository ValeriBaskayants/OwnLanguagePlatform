"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleChoiceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const multiple_choice_schema_1 = require("./schemas/multiple-choice.schema");
const multiple_choice_service_1 = require("./multiple-choice.service");
const multiple_choice_controller_1 = require("./multiple-choice.controller");
let MultipleChoiceModule = class MultipleChoiceModule {
};
exports.MultipleChoiceModule = MultipleChoiceModule;
exports.MultipleChoiceModule = MultipleChoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: multiple_choice_schema_1.MultipleChoice.name, schema: multiple_choice_schema_1.MultipleChoiceSchema }])],
        controllers: [multiple_choice_controller_1.MultipleChoiceController],
        providers: [multiple_choice_service_1.MultipleChoiceService],
        exports: [multiple_choice_service_1.MultipleChoiceService],
    })
], MultipleChoiceModule);
//# sourceMappingURL=multiple-choice.module.js.map