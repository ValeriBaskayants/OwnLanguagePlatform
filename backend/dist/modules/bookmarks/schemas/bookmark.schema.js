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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkSchema = exports.Bookmark = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Bookmark = class Bookmark {
};
exports.Bookmark = Bookmark;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Schema !== "undefined" && (_a = mongoose_2.Schema.Types) !== void 0 && _a.ObjectId) === "function" ? _b : Object)
], Bookmark.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Schema !== "undefined" && (_c = mongoose_2.Schema.Types) !== void 0 && _c.ObjectId) === "function" ? _d : Object)
], Bookmark.prototype, "itemId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['grammar_rule', 'vocabulary', 'reading', 'writing_prompt'], required: true }),
    __metadata("design:type", String)
], Bookmark.prototype, "itemType", void 0);
exports.Bookmark = Bookmark = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Bookmark);
exports.BookmarkSchema = mongoose_1.SchemaFactory.createForClass(Bookmark);
exports.BookmarkSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });
//# sourceMappingURL=bookmark.schema.js.map