import { PrismaService } from "./prisma.service";
import { RateLimiterService } from "./rate-limiter.service";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";
export declare class AppController {
    private readonly prisma;
    private readonly rateLimiter;
    private readonly telemetryGateway;
    constructor(prisma: PrismaService, rateLimiter: RateLimiterService, telemetryGateway: TelemetryGateway);
    getRoot(): {
        message: string;
    };
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    getVoiceConfig(): {
        supportedLanguages: string[];
        defaultLanguage: string;
        voiceModeEnabled: boolean;
    };
    analyzeText(req: any, body: {
        text: string;
        language?: string;
        tier?: string;
    }): Promise<any>;
    fetchHistory(req: any): Promise<{
        success: boolean;
        userId: any;
        count: number;
        history: {
            id: string;
            inputText: string;
            detectedLanguage: string;
            sentimentScore: number;
            biasIndex: number;
            createdAt: string;
        }[];
    }>;
    handleStripeWebhooks(body: {
        type: string;
        data: any;
    }): Promise<{
        received: boolean;
        event: string;
    }>;
    addCustomBiasRule(req: any, body: {
        pattern: string;
        category: string;
        rephrase: string;
    }): Promise<{
        success: boolean;
        ruleId: string;
        message: string;
    }>;
    getUserQuota(): {
        tier: string;
        limit: string;
        usedThisMonth: number;
        activeWorkspaceSeats: number;
        billingCycleReset: string;
    };
    createCheckoutSession(): {
        sessionId: string;
        url: string;
        message: string;
    };
    fetchAnalytics(req: any): Promise<{
        success: boolean;
        stats: {
            totalAnalyses: number;
            totalLogins: number;
            totalVoice: number;
            totalImages: number;
            totalTokens: any;
            avgLatencyMs: number;
            reliabilityPercent: number;
        };
        requestsOverTime: any[];
        contributionData: any[];
        languages: {
            name: string;
            value: number;
            color: string;
        }[];
        tones: {
            name: string;
            score: number;
        }[];
        logs: any[];
    }>;
    trackUserEvent(req: any, body: {
        activity: string;
        details?: string;
    }): Promise<{
        id: string;
        userId: string;
        activity: string;
        details: string;
        status: string;
        latencyMs: number;
        tokensCount: number;
        createdAt: Date;
    }>;
    getAdminUsers(): Promise<any[]>;
    updateAdminUserRole(id: string, body: {
        role: string;
    }): Promise<any>;
    updateAdminUserStatus(id: string, body: {
        isBlocked: boolean;
    }): Promise<any>;
    deleteAdminUser(id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    getAdminAnalytics(): Promise<{
        totalUsers: number;
        activeUsers: number;
        blockedUsers: number;
        monthlyRevenue: number;
        totalAnalyses: number;
        reliabilityPercent: number;
    }>;
    getAdminAuditLogs(): Promise<any[]>;
    getAdminPolicies(): Promise<{
        id: string;
        textEnabled: boolean;
        voiceEnabled: boolean;
        imageEnabled: boolean;
        limitFree: number;
        limitPro: number;
        limitTeam: number;
        rateFree: number;
        ratePro: number;
        rateTeam: number;
        experimentalToggle: boolean;
        updatedAt: Date;
    }>;
    updateAdminPolicies(body: any): Promise<{
        id: string;
        textEnabled: boolean;
        voiceEnabled: boolean;
        imageEnabled: boolean;
        limitFree: number;
        limitPro: number;
        limitTeam: number;
        rateFree: number;
        ratePro: number;
        rateTeam: number;
        experimentalToggle: boolean;
        updatedAt: Date;
    }>;
    getAdminTeams(): Promise<any[]>;
    createAdminTeam(body: any): Promise<{
        id: string;
        name: any;
        description: any;
        tier: any;
        status: any;
        maxMembers: number;
        createdAt: string;
        members: {
            id: string;
            role: string;
            userId: any;
            email: any;
        }[];
        leadEmail: any;
    }>;
    deleteAdminTeam(id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    updateAdminUserTier(id: string, body: {
        tier: string;
    }): Promise<any>;
    getUsersList(): Promise<any[]>;
    patchUserDetail(id: string, body: {
        role?: string;
        status?: string;
        plan?: string;
        name?: string;
    }): Promise<any>;
    deleteUserDetail(id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    getConfiguration(): Promise<{
        system: {
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        };
        ai: {};
    }>;
    updateConfiguration(body: any): Promise<{
        system: {
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        };
        ai: {};
    }>;
}
