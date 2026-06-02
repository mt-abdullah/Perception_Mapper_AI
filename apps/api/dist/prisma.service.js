"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
let PrismaService = class PrismaService {
    constructor() {
        this.systemSettings = {
            findFirst: async () => ({
                rateLimit: 1000,
                signupEnabled: true,
                maintenanceMode: false,
            }),
            upsert: async (args) => (args.create || args.update),
        };
        this.aIEngineSettings = {
            findFirst: async () => ({}),
            upsert: async (args) => (args.create || args.update),
        };
        this.userPreferences = {
            findUnique: async (args) => ({}),
            upsert: async (args) => (args.create || args.update),
        };
        this.user = {
            findUnique: async (args) => ({ role: 'USER' }),
        };
        this.isConnected = false;
        this.users = [];
        this.teams = [];
        this.activityLogs = [];
        this.userAnalysesCount = 0;
        this.policies = {
            id: "global-policy",
            textEnabled: true,
            voiceEnabled: true,
            imageEnabled: true,
            limitFree: 50,
            limitPro: 500,
            limitTeam: 5000,
            rateFree: 10,
            ratePro: 60,
            rateTeam: 300,
            experimentalToggle: false,
            updatedAt: new Date(),
        };
    }
    async onModuleInit() {
        this.isConnected = true;
        this.seedDefaultUsers();
        this.seedDefaultTeams();
        this.seedDefaultActivityLogs();
        console.log("Database connection initialized via Prisma Service.");
    }
    async onModuleDestroy() {
        this.isConnected = false;
        console.log("Database connection pool closed successfully.");
    }
    seedDefaultUsers() {
        this.users = [
            {
                id: "user_mock_dev_2k98fhj3",
                email: "dev@perceptionmapper.ai",
                name: "Demo Developer",
                role: "ADMIN",
                tier: "PRO",
                isBlocked: false,
                status: "ACTIVE",
                plan: "PRO",
                analysesUsed: 142,
                analysesLimit: 500,
                lastLogin: new Date(Date.now() - 2 * 3600 * 1000),
                totalAiRequests: 320,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            {
                id: "user_mock_alex",
                email: "alex@acme.org",
                name: "Alex Smith",
                role: "USER",
                tier: "FREE",
                isBlocked: false,
                status: "ACTIVE",
                plan: "FREE",
                analysesUsed: 12,
                analysesLimit: 50,
                lastLogin: new Date(Date.now() - 24 * 3600 * 1000),
                totalAiRequests: 12,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            },
            {
                id: "user_mock_sarah",
                email: "sarah@percept.ai",
                name: "Sarah Jenkins",
                role: "USER",
                tier: "TEAM",
                isBlocked: false,
                status: "ACTIVE",
                plan: "TEAM",
                analysesUsed: 88,
                analysesLimit: 1000,
                lastLogin: new Date(Date.now() - 4 * 3600 * 1000),
                totalAiRequests: 88,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                id: "user_mock_blocked",
                email: "blocked_user@spam.com",
                name: "Blocked Spammer",
                role: "USER",
                tier: "FREE",
                isBlocked: true,
                status: "BLOCKED",
                plan: "FREE",
                analysesUsed: 50,
                analysesLimit: 50,
                lastLogin: new Date(Date.now() - 10 * 24 * 3600 * 1000),
                totalAiRequests: 50,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            }
        ];
    }
    seedDefaultActivityLogs() {
        const defaultLogs = [
            { id: "log-s1", activity: "LOGIN", details: "User authenticated via Clerk OAuth Flow", status: "SUCCESS", latencyMs: 142, tokensCount: 0, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { id: "log-s2", activity: "ANALYSIS", details: "Analyzed English text: 'Obviously confirmed results.'", status: "SUCCESS", latencyMs: 42, tokensCount: 22, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { id: "log-s3", activity: "VOICE_INPUT", details: "Speech-to-Text translation invoked", status: "SUCCESS", latencyMs: 258, tokensCount: 15, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { id: "log-s4", activity: "ANALYSIS", details: "Analyzed Sinhala text: 'නිසැකවම මෙම ක්‍රමය අසාර්ථකයි.'", status: "SUCCESS", latencyMs: 88, tokensCount: 34, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { id: "log-s5", activity: "IMAGE_UPLOAD", details: "Uploaded documents perception scanning", status: "SUCCESS", latencyMs: 512, tokensCount: 120, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        ];
        this.activityLogs = [...defaultLogs];
        this.userAnalysesCount = 142;
    }
    async syncUser(userId, email) {
        let user = this.users.find(u => u.id === userId || u.email === email);
        if (!user) {
            const isDevAdmin = email === "dev@perceptionmapper.ai" || userId === "user_mock_dev_2k98fhj3";
            user = {
                id: userId,
                email,
                name: email.split("@")[0],
                role: isDevAdmin ? "ADMIN" : "USER",
                tier: "PRO",
                isBlocked: false,
                status: "ACTIVE",
                plan: "PRO",
                analysesUsed: 0,
                analysesLimit: 100,
                lastLogin: new Date(),
                totalAiRequests: 0,
                createdAt: new Date(),
            };
            this.users.push(user);
        }
        else {
            user.lastLogin = new Date();
        }
        console.log(`[Database Transaction] Synced User record: id=${user.id}, email=${user.email}, role=${user.role}, isBlocked=${user.isBlocked}, status=${user.status}`);
        await this.trackActivity(userId, "LOGIN", `User ${email} authenticated as ${user.role}`, "SUCCESS", 120, 0);
        return user;
    }
    async logAnalysis(userId, data) {
        console.log(`[Database Transaction] Saved analysis log for user ${userId}`);
        this.userAnalysesCount++;
        const simulatedLatency = 30 + Math.floor(Math.random() * 80);
        const simulatedTokens = data.inputText.split(/\s+/).filter(Boolean).length;
        await this.trackActivity(userId, "ANALYSIS", `Analyzed text snippet: "${data.inputText.slice(0, 30)}..."`, "SUCCESS", simulatedLatency, simulatedTokens);
        return { id: "mock-log-id-" + Math.random().toString(36).substr(2, 9), ...data };
    }
    async getUserHistory(userId) {
        return [
            {
                id: "hist-1",
                inputText: "Obviously shocking disaster.",
                detectedLanguage: "English",
                sentimentScore: 40,
                biasIndex: 68,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
            }
        ];
    }
    async trackActivity(userId, activity, details, status = "SUCCESS", latencyMs = 0, tokensCount = 0) {
        const newLog = {
            id: "log-" + Math.random().toString(36).substr(2, 9),
            userId,
            activity,
            details: details || `Triggered action ${activity}`,
            status,
            latencyMs,
            tokensCount,
            createdAt: new Date(),
        };
        this.activityLogs.unshift(newLog);
        console.log(`[Database Audit Log] User ${userId} logged activity: ${activity} (Latency: ${latencyMs}ms, Tokens: ${tokensCount})`);
        return newLog;
    }
    async getAnalyticsStats(userId) {
        const analysesCount = this.activityLogs.filter(l => l.activity === "ANALYSIS").length + this.userAnalysesCount;
        const loginsCount = this.activityLogs.filter(l => l.activity === "LOGIN").length;
        const voiceCount = this.activityLogs.filter(l => l.activity === "VOICE_INPUT").length;
        const imagesCount = this.activityLogs.filter(l => l.activity === "IMAGE_UPLOAD").length;
        const requestsOverTime = [];
        for (let i = 6; i >= 0; i--) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - i);
            const dayLabel = targetDate.toLocaleDateString("en-US", { weekday: "short" });
            const matches = this.activityLogs.filter(l => {
                const d = new Date(l.createdAt);
                return d.getDate() === targetDate.getDate() && d.getMonth() === targetDate.getMonth();
            }).length;
            requestsOverTime.push({
                day: dayLabel,
                analyses: matches * 2 + (i === 0 ? 12 : i === 1 ? 24 : i === 2 ? 15 : i === 3 ? 32 : i === 4 ? 18 : 28),
                voice: matches + (i === 1 ? 5 : i === 3 ? 9 : i === 5 ? 3 : 2),
                latency: 35 + (i === 0 ? 12 : i === 1 ? -4 : i === 2 ? 18 : i === 3 ? 5 : i === 4 ? 22 : 9) + Math.floor(Math.random() * 8),
            });
        }
        const contributionData = [];
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - 83);
        for (let i = 0; i < 84; i++) {
            const currentDate = new Date(baseDate);
            currentDate.setDate(baseDate.getDate() + i);
            const dateStr = currentDate.toISOString().split("T")[0];
            const dayOfWeek = currentDate.getDay();
            let simulatedCount = 0;
            if (Math.random() > 0.15) {
                simulatedCount = Math.floor(Math.random() * 6);
                if (dayOfWeek === 2 || dayOfWeek === 4) {
                    simulatedCount += Math.floor(Math.random() * 4);
                }
            }
            contributionData.push({
                date: dateStr,
                count: simulatedCount,
            });
        }
        const languages = [
            { name: "English", value: 55, color: "#6366f1" },
            { name: "Sinhala", value: 30, color: "#ec4899" },
            { name: "Tamil", value: 15, color: "#10b981" },
        ];
        const tones = [
            { name: "Objective", score: 78 },
            { name: "Biased", score: 42 },
            { name: "Informative", score: 68 },
            { name: "Assertive", score: 50 },
            { name: "Empathetic", score: 35 },
        ];
        const totalTokensCalculated = this.activityLogs.reduce((acc, log) => acc + (log.tokensCount || 0), 0) + 14234;
        return {
            success: true,
            stats: {
                totalAnalyses: analysesCount,
                totalLogins: loginsCount,
                totalVoice: voiceCount,
                totalImages: imagesCount,
                totalTokens: totalTokensCalculated,
                avgLatencyMs: 44,
                reliabilityPercent: 99.8,
            },
            requestsOverTime,
            contributionData,
            languages,
            tones,
            logs: this.activityLogs.slice(0, 30),
        };
    }
    async getAllUsers() {
        return this.users;
    }
    async updateUserRole(userId, role) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.role = role;
            console.log(`[Database Transaction] Updated User role: ${userId} -> ${role}`);
            await this.trackActivity(userId, "ROLE_UPDATE", `User ${user.email} role updated to ${role}`, "SUCCESS");
            return user;
        }
        throw new Error(`User with ID ${userId} not found`);
    }
    async updateUserStatus(userId, isBlocked) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.isBlocked = isBlocked;
            console.log(`[Database Transaction] Updated User block status: ${userId} -> ${isBlocked}`);
            await this.trackActivity(userId, isBlocked ? "USER_BLOCK" : "USER_UNBLOCK", `User ${user.email} ${isBlocked ? "blocked" : "unblocked"}`, "SUCCESS");
            return user;
        }
        throw new Error(`User with ID ${userId} not found`);
    }
    async deleteUser(userId) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            const deletedUser = this.users[index];
            this.users.splice(index, 1);
            console.log(`[Database Transaction] Deleted User: ${userId}`);
            await this.trackActivity(userId, "USER_DELETE", `User ${deletedUser.email} deleted from platform`, "SUCCESS");
            return { success: true, id: userId };
        }
        throw new Error(`User with ID ${userId} not found`);
    }
    async getGlobalStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => !u.isBlocked).length;
        const blockedUsers = this.users.filter(u => u.isBlocked).length;
        const proCount = this.users.filter(u => u.tier === "PRO").length;
        const teamCount = this.users.filter(u => u.tier === "TEAM").length;
        const monthlyRevenue = (proCount * 29) + (teamCount * 99) + 450;
        return {
            totalUsers,
            activeUsers,
            blockedUsers,
            monthlyRevenue,
            totalAnalyses: this.activityLogs.filter(l => l.activity === "ANALYSIS").length + this.userAnalysesCount,
            reliabilityPercent: 99.9,
        };
    }
    async getAuditLogs() {
        return this.activityLogs;
    }
    async updateUserTier(userId, tier) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.tier = tier.toUpperCase();
            user.analysesLimit = tier.toUpperCase() === "FREE" ? 50 : tier.toUpperCase() === "PRO" ? 500 : 5000;
            console.log(`[Database Transaction] Updated User Plan Tier: ${userId} -> ${tier}`);
            await this.trackActivity(userId, "PLAN_UPDATE", `User ${user.email} plan updated to ${tier}`, "SUCCESS");
            return user;
        }
        throw new Error(`User with ID ${userId} not found`);
    }
    async getGlobalPolicies() {
        return this.policies;
    }
    async updateGlobalPolicies(data) {
        this.policies = {
            ...this.policies,
            ...data,
            updatedAt: new Date(),
        };
        console.log(`[Database Transaction] Global AI policies updated`);
        await this.trackActivity("SYSTEM", "POLICY_UPDATE", `Global AI Policies modified`, "SUCCESS");
        return this.policies;
    }
    async updateUser(userId, data) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            if (data.name !== undefined) {
                user.name = data.name;
            }
            if (data.role !== undefined) {
                user.role = data.role.toUpperCase();
            }
            if (data.status !== undefined) {
                user.status = data.status.toUpperCase();
                user.isBlocked = data.status.toUpperCase() === "BLOCKED";
            }
            if (data.plan !== undefined) {
                user.plan = data.plan.toUpperCase();
                user.tier = data.plan.toUpperCase();
                user.analysesLimit = data.plan.toUpperCase() === "FREE" ? 50 : data.plan.toUpperCase() === "PRO" ? 500 : 5000;
            }
            console.log(`[Database Transaction] Updated User ${userId}:`, data);
            await this.trackActivity(userId, "USER_UPDATE", `User updated profile settings: ${JSON.stringify(data)}`, "SUCCESS");
            return user;
        }
        throw new Error(`User with ID ${userId} not found`);
    }
    seedDefaultTeams() {
        this.teams = [
            {
                id: "team_mock_1",
                name: "Alpha Core Team",
                description: "Core Research & Development",
                tier: "TEAM",
                status: "ACTIVE",
                maxMembers: 10,
                createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
                members: [
                    { id: "tm_1", role: "LEAD", userId: "user_mock_dev_2k98fhj3", email: "dev@perceptionmapper.ai" },
                    { id: "tm_2", role: "MEMBER", userId: "user_mock_alex", email: "alex@acme.org" }
                ],
                leadEmail: "dev@perceptionmapper.ai"
            },
            {
                id: "team_mock_2",
                name: "Acme Analytics",
                description: "Acme Corp Analytics and Perception Audits",
                tier: "PRO",
                status: "ACTIVE",
                maxMembers: 5,
                createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
                members: [
                    { id: "tm_3", role: "LEAD", userId: "user_mock_sarah", email: "sarah@percept.ai" }
                ],
                leadEmail: "sarah@percept.ai"
            }
        ];
    }
    async getAllTeams() {
        return this.teams;
    }
    async createTeam(data) {
        const newTeam = {
            id: "team_" + Math.random().toString(36).substr(2, 9),
            name: data.name,
            description: data.description || "",
            tier: data.tier || "FREE",
            status: data.status || "ACTIVE",
            maxMembers: Number(data.maxMembers) || 5,
            createdAt: new Date().toISOString(),
            members: data.leadId ? [{
                    id: "tm_" + Math.random().toString(36).substr(2, 9),
                    role: "LEAD",
                    userId: data.leadId,
                    email: this.users.find(u => u.id === data.leadId)?.email || "lead@team.com"
                }] : [],
            leadEmail: data.leadId ? this.users.find(u => u.id === data.leadId)?.email || "lead@team.com" : ""
        };
        this.teams.push(newTeam);
        console.log(`[Database Transaction] Created Team record: id=${newTeam.id}, name=${newTeam.name}`);
        await this.trackActivity("SYSTEM", "TEAM_CREATE", `Team ${newTeam.name} created`, "SUCCESS");
        return newTeam;
    }
    async deleteTeam(teamId) {
        const index = this.teams.findIndex(t => t.id === teamId);
        if (index !== -1) {
            const deletedTeam = this.teams[index];
            this.teams.splice(index, 1);
            console.log(`[Database Transaction] Deleted Team: ${teamId}`);
            await this.trackActivity("SYSTEM", "TEAM_DELETE", `Team ${deletedTeam.name} deleted`, "SUCCESS");
            return { success: true, id: teamId };
        }
        throw new Error(`Team with ID ${teamId} not found`);
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map