import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

@Injectable()
export class ClerkGuard implements CanActivate {
  private readonly logger = new Logger("ClerkGuard");
  private jwksClientInstance: any;

  constructor() {
    // Standard Clerk JWKS client retrieval setup
    const jwksUri = process.env.CLERK_JWKS_URI || "https://api.clerk.com/v1/jwks";
    this.jwksClientInstance = jwksClient({
      jwksUri: jwksUri,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Check if Clerk keys are missing (Scaffold/Dev Mode fallback)
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      this.logger.warn(
        "CLERK_SECRET_KEY is not defined. Falling back to Scaffolding/Dev Mode. All requests bypass verification."
      );
      // Inject mock user information to let development progress seamlessly
      request.user = {
        userId: "user_mock_dev_2k98fhj3",
        email: "dev@perceptionmapper.ai",
        tier: "pro",
      };
      return true;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      this.logger.warn("Authorization header missing or format invalid.");
      throw new UnauthorizedException("Bearer Authorization token required");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded: any = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException("Invalid JWT token format");
      }

      // Fetch the public signing key from Clerk JWKS endpoint
      const signingKey = await this.getSigningKey(decoded.header.kid);
      const publicKey = signingKey.getPublicKey();

      // Verify the JWT signature and expiration
      const verifiedPayload = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      }) as any;

      // Inject verified payload into request context
      request.user = {
        userId: verifiedPayload.sub, // Clerk user ID
        sessionId: verifiedPayload.sid, // Clerk session ID
      };

      return true;
    } catch (error) {
      this.logger.error(`Clerk JWT Verification failed: ${error.message}`);
      throw new UnauthorizedException("Session expired or token invalid");
    }
  }

  private getSigningKey(kid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.jwksClientInstance.getSigningKey(kid, (err: any, key: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });
  }
}
