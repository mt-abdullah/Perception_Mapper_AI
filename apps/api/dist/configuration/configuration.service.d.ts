import { PrismaService } from '../prisma.service';
import { Settings } from './dto/settings.dto';
export declare class ConfigurationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(userId: string): Promise<{
        system: {
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        };
        ai: {};
        user: {};
        admin: {
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        };
    }>;
    updateSettings(userId: string, data: Settings): Promise<{
        system: {
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        };
        ai: {};
        user: {};
        admin: {
            rateLimit: number;
            signupEnabled: boolean;
            maintenanceMode: boolean;
        };
    }>;
}
