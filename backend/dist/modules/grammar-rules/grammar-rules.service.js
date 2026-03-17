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
exports.GrammarRulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const grammar_rule_schema_1 = require("./schemas/grammar-rule.schema");
let GrammarRulesService = class GrammarRulesService {
    constructor(model) {
        this.model = model;
    }
    async findAll(level) {
        const filter = {};
        if (level)
            filter.level = level;
        return this.model.find(filter).lean();
    }
    async findBySlug(slug) {
        const rule = await this.model.findOne({ slug }).lean();
        if (!rule)
            throw new common_1.NotFoundException('Grammar rule not found');
        return rule;
    }
    async bulkCreate(rules) {
        let inserted = 0, skipped = 0, errors = 0;
        for (const rule of rules) {
            try {
                const exists = await this.model.findOne({ slug: rule.slug });
                if (exists) {
                    skipped++;
                    continue;
                }
                await this.model.create(rule);
                inserted++;
            }
            catch {
                errors++;
            }
        }
        return { inserted, skipped, errors };
    }
};
exports.GrammarRulesService = GrammarRulesService;
exports.GrammarRulesService = GrammarRulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(grammar_rule_schema_1.GrammarRule.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], GrammarRulesService);
//# sourceMappingURL=grammar-rules.service.js.map