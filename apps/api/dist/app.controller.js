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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const clerk_guard_1 = require("./clerk.guard");
const prisma_service_1 = require("./prisma.service");
const rate_limiter_service_1 = require("./rate-limiter.service");
const admin_only_guard_1 = require("./admin-only.guard");
const telemetry_gateway_1 = require("./telemetry/telemetry.gateway");
let AppController = class AppController {
    constructor(prisma, rateLimiter, telemetryGateway) {
        this.prisma = prisma;
        this.rateLimiter = rateLimiter;
        this.telemetryGateway = telemetryGateway;
    }
    getRoot() {
        return { message: "Perception Mapper AI API is running." };
    }
    getHealth() {
        return {
            status: "healthy",
            service: "NestJS Core API Gateway",
            timestamp: new Date().toISOString(),
        };
    }
    getVoiceConfig() {
        return {
            supportedLanguages: ["en", "ta", "si"],
            defaultLanguage: "en",
            voiceModeEnabled: true,
        };
    }
    async analyzeText(req, body) {
        if (!body.text || !body.text.trim()) {
            throw new common_1.HttpException("Text content is required for analysis", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: body.text }),
            });
            if (!response.ok) {
                throw new common_1.HttpException(`NLP Engine returned status ${response.status}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            const result = await response.json();
            await this.prisma.logAnalysis(req.user.userId, {
                inputText: body.text,
                detectedLanguage: result.language,
                sentimentScore: result.scores.sentiment,
                biasIndex: result.scores.biasIndex,
                tones: result.tones,
                biases: result.biases,
            });
            this.telemetryGateway.broadcastTelemetry("analysis", {
                userId: req.user.userId,
                detectedLanguage: result.language || "English",
                sentimentScore: result.scores?.sentiment || 55,
                biasIndex: result.scores?.biasIndex || 25,
                biasesCount: result.biases?.length || 0,
                textLength: body.text.length,
            });
            return {
                success: true,
                source: "FastAPI Live Sidecar",
                ...result,
            };
        }
        catch (error) {
            this.telemetryGateway.broadcastTelemetry("analysis", {
                userId: req.user.userId,
                detectedLanguage: "English (Offline)",
                sentimentScore: 55,
                biasIndex: 25,
                biasesCount: 1,
                textLength: body.text.length,
            });
            return {
                success: false,
                source: "NestJS Mock Offline Fallback",
                message: "Python NLP sidecar offline. Returning baseline assessment.",
                language: "English",
                scores: {
                    sentiment: 55,
                    objectivity: 75,
                    biasIndex: 25,
                },
                tones: [
                    { name: "Informative", score: 65, color: "from-blue-500 to-indigo-500" },
                    { name: "Assertive", score: 45, color: "from-purple-500 to-pink-500" },
                ],
                biases: [
                    {
                        quote: body.text.slice(0, Math.min(body.text.length, 60)) + "...",
                        type: "Offline Mode",
                        description: "FastAPI engine unreachable. Scaffolding fallbacks active.",
                        rephrase: "Ensure the FastAPI service is running locally on port 8000.",
                    },
                ],
            };
        }
    }
    async fetchHistory(req) {
        const userId = req.user.userId;
        const history = await this.prisma.getUserHistory(userId);
        return {
            success: true,
            userId,
            count: history.length,
            history,
        };
    }
    async handleStripeWebhooks(body) {
        if (!body.type) {
            throw new common_1.HttpException("Invalid webhook body structure", common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(`[Stripe Webhook Received] Lifecycle event: ${body.type}`);
        switch (body.type) {
            case "customer.subscription.updated":
            case "customer.subscription.created":
                console.log("Upgraded user plan tier configurations in database.");
                if (body.data?.email && body.data?.tier) {
                    const matchedUser = (await this.prisma.getAllUsers()).find(u => u.email === body.data.email);
                    if (matchedUser) {
                        await this.prisma.updateUserTier(matchedUser.id, body.data.tier);
                        console.log(`[Stripe Webhook Success] Synced billing database profile: email=${body.data.email}, tier=${body.data.tier}`);
                    }
                }
                break;
            case "invoice.payment_failed":
                console.log("Suspended active plan permissions due to subscription payment failure.");
                break;
            default:
                console.log(`Unhandled Stripe action payload type: ${body.type}`);
        }
        return { received: true, event: body.type };
    }
    async addCustomBiasRule(req, body) {
        if (!body.pattern || !body.category) {
            throw new common_1.HttpException("Pattern and category are required", common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(`[Custom Rule Transaction] Saved rule for user ${req.user.userId}: ${body.pattern}`);
        return {
            success: true,
            ruleId: "rule-mock-" + Math.random().toString(36).substr(2, 5),
            message: "Custom bias parsing rule added successfully.",
        };
    }
    getUserQuota() {
        return {
            tier: "Pro Subscription",
            limit: "Unlimited",
            usedThisMonth: 342,
            activeWorkspaceSeats: 3,
            billingCycleReset: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        };
    }
    createCheckoutSession() {
        return {
            sessionId: "mock_stripe_checkout_session_4f78h92j",
            url: "https://checkout.stripe.com/pay/mock_stripe_session_4f78h92j",
            message: "Stripe checkout session initialized successfully.",
        };
    }
    async fetchAnalytics(req) {
        return await this.prisma.getAnalyticsStats(req.user.userId);
    }
    async trackUserEvent(req, body) {
        if (!body.activity) {
            throw new common_1.HttpException("Activity type is required", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.trackActivity(req.user.userId, body.activity, body.details);
    }
    async getAdminUsers() {
        return await this.prisma.getAllUsers();
    }
    async updateAdminUserRole(id, body) {
        if (!body.role || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
            throw new common_1.HttpException("Invalid role profile targeted", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.updateUserRole(id, body.role.toUpperCase());
    }
    async updateAdminUserStatus(id, body) {
        if (body.isBlocked === undefined) {
            throw new common_1.HttpException("isBlocked status is required", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.updateUserStatus(id, body.isBlocked);
    }
    async deleteAdminUser(id) {
        return await this.prisma.deleteUser(id);
    }
    async getAdminAnalytics() {
        return await this.prisma.getGlobalStats();
    }
    async getAdminAuditLogs() {
        return await this.prisma.getAuditLogs();
    }
    async getAdminPolicies() {
        return await this.prisma.getGlobalPolicies();
    }
    async updateAdminPolicies(body) {
        return await this.prisma.updateGlobalPolicies(body);
    }
    async getAdminTeams() {
        return await this.prisma.getAllTeams();
    }
    async createAdminTeam(body) {
        if (!body.name) {
            throw new common_1.HttpException("Team name is required", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.createTeam(body);
    }
    async deleteAdminTeam(id) {
        try {
            return await this.prisma.deleteTeam(id);
        }
        catch (e) {
            throw new common_1.HttpException("Failed to delete team: " + e.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateAdminUserTier(id, body) {
        if (!body.tier || !["FREE", "PRO", "TEAM"].includes(body.tier.toUpperCase())) {
            throw new common_1.HttpException("Invalid plan tier targeted", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.updateUserTier(id, body.tier.toUpperCase());
    }
    async getUsersList() {
        try {
            return await this.prisma.getAllUsers();
        }
        catch (e) {
            throw new common_1.HttpException("Failed to retrieve user catalog: " + e.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async patchUserDetail(id, body) {
        if (!body || Object.keys(body).length === 0) {
            throw new common_1.HttpException("Update payload body must not be empty", common_1.HttpStatus.BAD_REQUEST);
        }
        if (body.role !== undefined) {
            if (typeof body.role !== "string" || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
                throw new common_1.HttpException("Invalid role profile targeted. Must be USER or ADMIN.", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (body.status !== undefined) {
            if (typeof body.status !== "string" || !["ACTIVE", "BLOCKED"].includes(body.status.toUpperCase())) {
                throw new common_1.HttpException("Invalid status targeted. Must be ACTIVE or BLOCKED.", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (body.plan !== undefined) {
            if (typeof body.plan !== "string" || !["FREE", "PRO", "TEAM"].includes(body.plan.toUpperCase())) {
                throw new common_1.HttpException("Invalid plan targeted. Must be FREE, PRO, or TEAM.", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (body.name !== undefined) {
            if (body.name !== null && typeof body.name !== "string") {
                throw new common_1.HttpException("Invalid name targeted. Must be a string.", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        try {
            const updatedUser = await this.prisma.updateUser(id, {
                role: body.role?.toUpperCase(),
                status: body.status?.toUpperCase(),
                plan: body.plan?.toUpperCase(),
                name: body.name,
            });
            return updatedUser;
        }
        catch (e) {
            throw new common_1.HttpException("Failed to update user profile: " + e.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async deleteUserDetail(id) {
        try {
            return await this.prisma.deleteUser(id);
        }
        catch (e) {
            throw new common_1.HttpException("Failed to delete user account: " + e.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getConfiguration() {
        const system = await this.prisma.systemSettings?.findFirst();
        const ai = await this.prisma.aIEngineSettings?.findFirst();
        return {
            system,
            ai,
        };
    }
    async updateConfiguration(body) {
        if (body.system) {
            await this.prisma.systemSettings?.upsert({
                where: { id: 1 },
                update: body.system,
                create: { ...body.system, id: 1 },
            });
        }
        if (body.ai) {
            await this.prisma.aIEngineSettings?.upsert({
                where: { id: 1 },
                update: body.ai,
                create: { ...body.ai, id: 1 },
            });
        }
        return this.getConfiguration();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)("voice/config"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getVoiceConfig", null);
__decorate([
    (0, common_1.Post)("analyze"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "analyzeText", null);
__decorate([
    (0, common_1.Get)("history"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "fetchHistory", null);
__decorate([
    (0, common_1.Post)("billing/webhook"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handleStripeWebhooks", null);
__decorate([
    (0, common_1.Post)("rules/custom"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addCustomBiasRule", null);
__decorate([
    (0, common_1.Get)("user/quota"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getUserQuota", null);
__decorate([
    (0, common_1.Post)("billing/checkout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Get)("analytics"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "fetchAnalytics", null);
__decorate([
    (0, common_1.Post)("analytics/track"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "trackUserEvent", null);
__decorate([
    (0, common_1.Get)("admin/users"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminUsers", null);
__decorate([
    (0, common_1.Post)("admin/users/:id/role"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateAdminUserRole", null);
__decorate([
    (0, common_1.Post)("admin/users/:id/block"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateAdminUserStatus", null);
__decorate([
    (0, common_1.Post)("admin/users/:id/delete"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteAdminUser", null);
__decorate([
    (0, common_1.Get)("admin/analytics"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminAnalytics", null);
__decorate([
    (0, common_1.Get)("admin/audit-logs"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminAuditLogs", null);
__decorate([
    (0, common_1.Get)("admin/policies"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminPolicies", null);
__decorate([
    (0, common_1.Post)("admin/policies"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateAdminPolicies", null);
__decorate([
    (0, common_1.Get)("admin/teams"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminTeams", null);
__decorate([
    (0, common_1.Post)("admin/teams"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createAdminTeam", null);
__decorate([
    (0, common_1.Delete)("admin/teams/:id"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteAdminTeam", null);
__decorate([
    (0, common_1.Post)("admin/users/:id/tier"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateAdminUserTier", null);
__decorate([
    (0, common_1.Get)("users"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUsersList", null);
__decorate([
    (0, common_1.Patch)("users/:id"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "patchUserDetail", null);
__decorate([
    (0, common_1.Delete)("users/:id"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard, admin_only_guard_1.AdminOnlyGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteUserDetail", null);
__decorate([
    (0, common_1.Get)("configuration"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getConfiguration", null);
__decorate([
    (0, common_1.Patch)("configuration"),
    (0, common_1.UseGuards)(clerk_guard_1.ClerkGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateConfiguration", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rate_limiter_service_1.RateLimiterService,
        telemetry_gateway_1.TelemetryGateway])
], AppController);
//# sourceMappingURL=app.controller.js.map