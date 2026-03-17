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
exports.ListeningService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const listening_schema_1 = require("./schemas/listening.schema");
let ListeningService = class ListeningService {
    constructor(model) {
        this.model = model;
    }
    async findAll(query) {
        const filter = {};
        if (query.level)
            filter.level = query.level;
        if (query.type)
            filter.type = query.type;
        return this.model.find(filter).limit(query.limit || 100).lean();
    }
    async findRandom(level, count) {
        return this.model.aggregate([{ $match: { level } }, { $sample: { size: count } }]);
    }
    async bulkCreate(items) {
        let inserted = 0, skipped = 0, errors = 0;
        for (const item of items) {
            try {
                await this.model.create(item);
                inserted++;
            }
            catch {
                errors++;
            }
        }
        return { inserted, skipped, errors };
    }
};
exports.ListeningService = ListeningService;
exports.ListeningService = ListeningService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(listening_schema_1.Listening.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ListeningService);
//# sourceMappingURL=listening.service.js.map