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
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const exercise_schema_1 = require("./schemas/exercise.schema");
let ExercisesService = class ExercisesService {
    constructor(model) {
        this.model = model;
    }
    async findAll(query) {
        const filter = {};
        if (query.level)
            filter.level = query.level;
        if (query.difficulty)
            filter.difficulty = query.difficulty;
        if (query.topic)
            filter.topic = { $regex: query.topic, $options: 'i' };
        return this.model.find(filter).limit(query.limit || 100).lean();
    }
    async getTopics(level) {
        const filter = {};
        if (level)
            filter.level = level;
        const topics = await this.model.distinct('topic', filter);
        return topics.sort();
    }
    async bulkCreate(exercises) {
        let inserted = 0, skipped = 0, errors = 0;
        for (const ex of exercises) {
            try {
                const exists = await this.model.findOne({ sentence: ex.sentence });
                if (exists) {
                    skipped++;
                    continue;
                }
                await this.model.create(ex);
                inserted++;
            }
            catch {
                errors++;
            }
        }
        return { inserted, skipped, errors };
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(exercise_schema_1.Exercise.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map