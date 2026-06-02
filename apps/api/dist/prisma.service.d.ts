import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    systemSettings: {
        findFirst: () => Promise<{
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        }>;
        upsert: (args: any) => Promise<any>;
    };
    aIEngineSettings: {
        findFirst: () => Promise<{}>;
        upsert: (args: any) => Promise<any>;
    };
    userPreferences: {
        findUnique: (args: any) => Promise<{}>;
        upsert: (args: any) => Promise<any>;
    };
    user: {
        findUnique: (args: any) => Promise<{
            role: string;
        }>;
    };
    private isConnected;
    private users;
    private teams;
    private activityLogs;
    private userAnalysesCount;
    private policies;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private seedDefaultUsers;
    private seedDefaultActivityLogs;
    syncUser(userId: string, email: string): Promise<any>;
    logAnalysis(userId: string, data: any): Promise<any>;
    getUserHistory(userId: string): Promise<{
        id: string;
        inputText: string;
        detectedLanguage: string;
        sentimentScore: number;
        biasIndex: number;
        createdAt: string;
    }[]>;
    trackActivity(userId: string, activity: string, details?: string, status?: string, latencyMs?: number, tokensCount?: number): Promise<{
        id: string;
        userId: string;
        activity: string;
        details: string;
        status: string;
        latencyMs: number;
        tokensCount: number;
        createdAt: Date;
    }>;
    getAnalyticsStats(userId: string): Promise<{
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
    getAllUsers(): Promise<any[]>;
    updateUserRole(userId: string, role: string): Promise<any>;
    updateUserStatus(userId: string, isBlocked: boolean): Promise<any>;
    deleteUser(userId: string): Promise<{
        success: boolean;
        id: string;
    }>;
    getGlobalStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        blockedUsers: number;
        monthlyRevenue: number;
        totalAnalyses: number;
        reliabilityPercent: number;
    }>;
    getAuditLogs(): Promise<any[]>;
    updateUserTier(userId: string, tier: string): Promise<any>;
    getGlobalPolicies(): Promise<{
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
    updateGlobalPolicies(data: any): Promise<{
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
    updateUser(userId: string, data: {
        name?: string;
        role?: string;
        status?: string;
        plan?: string;
    }): Promise<any>;
    private seedDefaultTeams;
    getAllTeams(): Promise<any[]>;
    createTeam(data: any): Promise<{
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
    deleteTeam(teamId: string): Promise<{
        success: boolean;
        id: string;
    }>;
}
