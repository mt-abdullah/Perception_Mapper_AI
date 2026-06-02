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
exports.ClerkGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const prisma_service_1 = require("./prisma.service");
const jwksClient = typeof jwksRsa === "function"
    ? jwksRsa
    : (jwksRsa.default || jwksRsa);
let ClerkGuard = class ClerkGuard {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger("ClerkGuard");
        const jwksUri = process.env.CLERK_JWKS_URI || "https://api.clerk.com/v1/jwks";
        this.jwksClientInstance = jwksClient({
            jwksUri: jwksUri,
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10,
        });
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const secretKey = process.env.CLERK_SECRET_KEY;
        if (!secretKey) {
            this.logger.warn("CLERK_SECRET_KEY is not defined. Falling back to Scaffolding/Dev Mode. All requests bypass verification.");
            const mockUserId = "user_mock_dev_2k98fhj3";
            const mockEmail = "dev@perceptionmapper.ai";
            const dbUser = await this.prisma.syncUser(mockUserId, mockEmail);
            const clientMockRole = request.headers["x-mock-role"];
            if (clientMockRole) {
                dbUser.role = clientMockRole.toString().toUpperCase();
            }
            if (dbUser.isBlocked) {
                throw new common_1.ForbiddenException("Access Denied: Your account has been suspended by an administrator.");
            }
            request.user = {
                userId: dbUser.id,
                email: dbUser.email,
                tier: dbUser.tier,
                role: dbUser.role,
            };
            return true;
        }
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            this.logger.warn("Authorization header missing or format invalid.");
            throw new common_1.UnauthorizedException("Bearer Authorization token required");
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.decode(token, { complete: true });
            if (!decoded || !decoded.header || !decoded.header.kid) {
                throw new common_1.UnauthorizedException("Invalid JWT token format");
            }
            const signingKey = await this.getSigningKey(decoded.header.kid);
            const publicKey = signingKey.getPublicKey();
            const verifiedPayload = jwt.verify(token, publicKey, {
                algorithms: ["RS256"],
            });
            const userEmail = verifiedPayload.email || "user@perceptionmapper.ai";
            const dbUser = await this.prisma.syncUser(verifiedPayload.sub, userEmail);
            const clientMockRole = request.headers["x-mock-role"];
            if (clientMockRole) {
                dbUser.role = clientMockRole.toString().toUpperCase();
            }
            if (dbUser.isBlocked) {
                throw new common_1.ForbiddenException("Access Denied: Your account has been suspended by an administrator.");
            }
            request.user = {
                userId: dbUser.id,
                sessionId: verifiedPayload.sid,
                email: dbUser.email,
                tier: dbUser.tier,
                role: dbUser.role,
            };
            return true;
        }
        catch (error) {
            this.logger.error(`Clerk JWT Verification failed: ${error.message}`);
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.UnauthorizedException("Session expired or token invalid");
        }
    }
    getSigningKey(kid) {
        return new Promise((resolve, reject) => {
            this.jwksClientInstance.getSigningKey(kid, (err, key) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(key);
                }
            });
        });
    }
};
exports.ClerkGuard = ClerkGuard;
exports.ClerkGuard = ClerkGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClerkGuard);
//# sourceMappingURL=clerk.guard.js.map