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
exports.WritingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const writing_service_1 = require("./writing.service");
let WritingController = class WritingController {
    constructor(service) {
        this.service = service;
    }
    getPrompts(level) {
        return this.service.getPrompts(level);
    }
    getPrompt(id) {
        return this.service.getPromptById(id);
    }
    submit(req, body) {
        return this.service.submit(req.user.sub, body.promptId, body.text);
    }
    getSubmissions(req, promptId) {
        return this.service.getSubmissions(req.user.sub, promptId);
    }
    getSubmission(req, id) {
        return this.service.getSubmission(id, req.user.sub);
    }
};
exports.WritingController = WritingController;
__decorate([
    (0, common_1.Get)('prompts'),
    __param(0, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WritingController.prototype, "getPrompts", null);
__decorate([
    (0, common_1.Get)('prompts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WritingController.prototype, "getPrompt", null);
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WritingController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('submissions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('promptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WritingController.prototype, "getSubmissions", null);
__decorate([
    (0, common_1.Get)('submissions/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WritingController.prototype, "getSubmission", null);
exports.WritingController = WritingController = __decorate([
    (0, common_1.Controller)('api/writing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [writing_service_1.WritingService])
], WritingController);
//# sourceMappingURL=writing.controller.js.map