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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(service) {
        this.service = service;
    }
    checkAdmin(req) {
        if (req.user?.role !== 'admin') {
            throw new common_1.ForbiddenException('Admin access required');
        }
    }
    importExercises(body, req) {
        this.checkAdmin(req);
        return this.service.importExercises(body);
    }
    importGrammarRules(body, req) {
        this.checkAdmin(req);
        return this.service.importGrammarRules(body);
    }
    importVocabulary(body, req) {
        this.checkAdmin(req);
        return this.service.importVocabulary(body);
    }
    importReadings(body, req) {
        this.checkAdmin(req);
        return this.service.importReadings(body);
    }
    importMC(body, req) {
        this.checkAdmin(req);
        return this.service.importMultipleChoice(body);
    }
    importWriting(body, req) {
        this.checkAdmin(req);
        return this.service.importWritingPrompts(body);
    }
    importListening(body, req) {
        this.checkAdmin(req);
        return this.service.importListening(body);
    }
    getStats(req) {
        this.checkAdmin(req);
        return this.service.getStats();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('import/exercises'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importExercises", null);
__decorate([
    (0, common_1.Post)('import/grammar-rules'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importGrammarRules", null);
__decorate([
    (0, common_1.Post)('import/vocabulary'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importVocabulary", null);
__decorate([
    (0, common_1.Post)('import/readings'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importReadings", null);
__decorate([
    (0, common_1.Post)('import/multiple-choice'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importMC", null);
__decorate([
    (0, common_1.Post)('import/writing-prompts'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importWriting", null);
__decorate([
    (0, common_1.Post)('import/listening'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importListening", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('api/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map