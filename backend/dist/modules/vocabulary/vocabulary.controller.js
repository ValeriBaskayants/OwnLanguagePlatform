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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabularyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const vocabulary_service_1 = require("./vocabulary.service");
let VocabularyController = class VocabularyController {
    constructor(service) {
        this.service = service;
    }
    findAll(q) {
        return this.service.findAll({ level: q.level, type: q.type, search: q.search, limit: +q.limit });
    }
    getFlashcards(req, q) {
        return this.service.getFlashcards(req.user.sub, q.level, +q.limit || 20);
    }
    getUserProgress(req) {
        return this.service.getUserProgress(req.user.sub);
    }
    review(req, body) {
        return this.service.reviewWord(req.user.sub, body.wordId, body.quality);
    }
};
exports.VocabularyController = VocabularyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('flashcards'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "getFlashcards", null);
__decorate([
    (0, common_1.Get)('user-progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Post)('review'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "review", null);
exports.VocabularyController = VocabularyController = __decorate([
    (0, common_1.Controller)('api/vocabulary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vocabulary_service_1.VocabularyService])
], VocabularyController);
//# sourceMappingURL=vocabulary.controller.js.map