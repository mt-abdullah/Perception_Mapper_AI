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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ConfigurationService = class ConfigurationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(userId) {
        const system = await this.prisma.systemSettings.findFirst();
        const ai = await this.prisma.aIEngineSettings.findFirst();
        const userPref = await this.prisma.userPreferences.findUnique({ where: { userId } });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const isAdmin = user?.role === 'ADMIN';
        return {
            system,
            ai,
            user: userPref,
            admin: isAdmin ? { rateLimit: system?.rateLimit, signupEnabled: system?.signupEnabled, maintenanceMode: system?.maintenanceMode } : undefined,
        };
    }
    async updateSettings(userId, data) {
        if (data.system) {
            await this.prisma.systemSettings.upsert({
                where: { id: 1 },
                update: data.system,
                create: { ...data.system, id: 1 },
            });
        }
        if (data.ai) {
            await this.prisma.aIEngineSettings.upsert({
                where: { id: 1 },
                update: data.ai,
                create: { ...data.ai, id: 1 },
            });
        }
        if (data.user) {
            await this.prisma.userPreferences.upsert({
                where: { userId },
                update: data.user,
                create: { ...data.user, userId },
            });
        }
        return this.getSettings(userId);
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConfigurationService);
//# sourceMappingURL=configuration.service.js.map