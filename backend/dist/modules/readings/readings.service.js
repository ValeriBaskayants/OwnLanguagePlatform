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
exports.ReadingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reading_schema_1 = require("./schemas/reading.schema");
let ReadingsService = class ReadingsService {
    constructor(model) {
        this.model = model;
    }
    async findAll(level, topic) {
        const filter = {};
        if (level)
            filter.level = level;
        if (topic)
            filter.topic = { $regex: topic, $options: 'i' };
        return this.model.find(filter).select('-questions').lean();
    }
    async findById(id) {
        const r = await this.model.findById(id).lean();
        if (!r)
            throw new common_1.NotFoundException('Reading not found');
        return r;
    }
    async bulkCreate(readings) {
        let inserted = 0, skipped = 0, errors = 0;
        for (const r of readings) {
            try {
                r.wordCount = r.content?.trim().split(/\s+/).length || 0;
                r.estimatedMinutes = Math.max(1, Math.ceil(r.wordCount / 200));
                const exists = await this.model.findOne({ title: r.title });
                if (exists) {
                    skipped++;
                    continue;
                }
                await this.model.create(r);
                inserted++;
            }
            catch {
                errors++;
            }
        }
        return { inserted, skipped, errors };
    }
};
exports.ReadingsService = ReadingsService;
exports.ReadingsService = ReadingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reading_schema_1.Reading.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ReadingsService);
//# sourceMappingURL=readings.service.js.map