import { CanActivate, ExecutionContext } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
export declare class ClerkGuard implements CanActivate {
    private readonly prisma;
    private readonly logger;
    private jwksClientInstance;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getSigningKey;
}
