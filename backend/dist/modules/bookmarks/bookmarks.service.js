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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bookmark_schema_1 = require("./schemas/bookmark.schema");
let BookmarksService = class BookmarksService {
    constructor(model) {
        this.model = model;
    }
    async findAll(userId) {
        return this.model.find({ userId }).lean();
    }
    async toggle(userId, itemId, itemType) {
        const existing = await this.model.findOne({ userId, itemId, itemType });
        if (existing) {
            await this.model.deleteOne({ _id: existing._id });
            return { bookmarked: false };
        }
        await this.model.create({ userId, itemId, itemType });
        return { bookmarked: true };
    }
    async remove(userId, id) {
        await this.model.deleteOne({ _id: id, userId });
        return { deleted: true };
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bookmark_schema_1.Bookmark.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map