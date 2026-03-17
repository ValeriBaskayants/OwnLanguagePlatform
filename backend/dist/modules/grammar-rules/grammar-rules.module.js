"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarRulesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const grammar_rule_schema_1 = require("./schemas/grammar-rule.schema");
const grammar_rules_service_1 = require("./grammar-rules.service");
const grammar_rules_controller_1 = require("./grammar-rules.controller");
let GrammarRulesModule = class GrammarRulesModule {
};
exports.GrammarRulesModule = GrammarRulesModule;
exports.GrammarRulesModule = GrammarRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: grammar_rule_schema_1.GrammarRule.name, schema: grammar_rule_schema_1.GrammarRuleSchema }])],
        controllers: [grammar_rules_controller_1.GrammarRulesController],
        providers: [grammar_rules_service_1.GrammarRulesService],
        exports: [grammar_rules_service_1.GrammarRulesService],
    })
], GrammarRulesModule);
//# sourceMappingURL=grammar-rules.module.js.map