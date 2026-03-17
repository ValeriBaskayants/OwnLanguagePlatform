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
exports.MistakesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mistake_schema_1 = require("./schemas/mistake.schema");
let MistakesService = class MistakesService {
    constructor(model) {
        this.model = model;
    }
    async findAll(userId, itemType) {
        const filter = { userId };
        if (itemType)
            filter.itemType = itemType;
        return this.model.find(filter).sort({ occurrenceCount: -1 }).lean();
    }
    async getWeakSpots(userId) {
        return this.model.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: { topic: '$topic', itemType: '$itemType' }, count: { $sum: '$occurrenceCount' }, level: { $first: '$level' } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { topic: '$_id.topic', itemType: '$_id.itemType', count: 1, level: 1, _id: 0 } },
        ]);
    }
};
exports.MistakesService = MistakesService;
exports.MistakesService = MistakesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(mistake_schema_1.Mistake.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], MistakesService);
//# sourceMappingURL=mistakes.service.js.map