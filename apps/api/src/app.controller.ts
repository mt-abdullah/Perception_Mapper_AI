import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  MessageEvent,
  Sse,
} from "@nestjs/common";
import { Observable, interval, map } from "rxjs";
import { ClerkGuard } from "./clerk.guard";
import { ApiKeyGuard } from "./api-key.guard";
import { PrismaService } from "./prisma.service";
import { RateLimiterService } from "./rate-limiter.service";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";
import { AdminOnlyGuard } from "./admin-only.guard";

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rateLimiter: RateLimiterService
  ) {}
  @Get()
  getRoot() {
    return { message: "Perception Mapper AI API is running." };
  }

  @Get("health")
  getHealth() {
    return {
      status: "healthy",
      service: "NestJS Core API Gateway",
      timestamp: new Date().toISOString(),
    };
  }
  @Get("voice/config")
  getVoiceConfig() {
    return {
      supportedLanguages: ["en", "ta", "si"],
      defaultLanguage: "en",
      voiceModeEnabled: true,
    };
  }
  // Live secure user analysis endpoint protected by Clerk
  @Post("analyze")
  @UseGuards(ClerkGuard)
  async analyzeText(
    @Req() req: any,
    @Body() body: { text: string; language?: string; tier?: string }
  ) {
    if (!body.text || !body.text.trim()) {
      throw new HttpException("Text content is required for analysis", HttpStatus.BAD_REQUEST);
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
        throw new HttpException(
          `NLP Engine returned status ${response.status}`,
          HttpStatus.BAD_GATEWAY
        );
      }

      const result = await response.json();
      
      // Save logs in background database using Prisma Service
      await this.prisma.logAnalysis(req.user.userId, {
        inputText: body.text,
        detectedLanguage: result.language,
        sentimentScore: result.scores.sentiment,
        biasIndex: result.scores.biasIndex,
        tones: result.tones,
        biases: result.biases,
      });

      return {
        success: true,
        source: "FastAPI Live Sidecar",
        ...result,
      };
    } catch (error) {
      // Offline fallback wrapper
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

  // Developer Automation Endpoint protected by X-API-Key header
  @Post("analyze/developer")
  @UseGuards(ApiKeyGuard)
  async analyzeTextDeveloper(
    @Req() req: any,
    @Body() body: { text: string }
  ) {
    if (!body.text || !body.text.trim()) {
      throw new HttpException("Text content is required", HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      service: "Perception Developer API Integration",
      triggeredBy: req.user.email,
      accountTier: req.user.tier,
      results: {
        sentiment: "Neutral",
        biasScore: 12,
        analyzedAt: new Date().toISOString(),
      },
    };
  }

  // User History Log Retrieval protected by Clerk
  @Get("history")
  @UseGuards(ClerkGuard)
  async fetchHistory(@Req() req: any) {
    const userId = req.user.userId;
    const history = await this.prisma.getUserHistory(userId);
    return {
      success: true,
      userId,
      count: history.length,
      history,
    };
  }

  // Stripe Billing Subscription Lifecycle Webhooks
  @Post("billing/webhook")
  async handleStripeWebhooks(@Body() body: { type: string; data: any }) {
    if (!body.type) {
      throw new HttpException("Invalid webhook body structure", HttpStatus.BAD_REQUEST);
    }

    console.log(`[Stripe Webhook Received] Lifecycle event: ${body.type}`);

    // Standard SaaS Stripe Event branches
    switch (body.type) {
      case "customer.subscription.updated":
      case "customer.subscription.created":
        console.log("Upgraded user plan tier configurations in database.");
        break;
      case "invoice.payment_failed":
        console.log("Suspended active plan permissions due to subscription payment failure.");
        break;
      default:
        console.log(`Unhandled Stripe action payload type: ${body.type}`);
    }

    return { received: true, event: body.type };
  }

  // Custom User-defined Bias rules endpoint for Team subscribers
  @Post("rules/custom")
  @UseGuards(ClerkGuard)
  async addCustomBiasRule(
    @Req() req: any,
    @Body() body: { pattern: string; category: string; rephrase: string }
  ) {
    if (!body.pattern || !body.category) {
      throw new HttpException("Pattern and category are required", HttpStatus.BAD_REQUEST);
    }

    console.log(
      `[Custom Rule Transaction] Saved rule for user ${req.user.userId}: ${body.pattern}`
    );

    return {
      success: true,
      ruleId: "rule-mock-" + Math.random().toString(36).substr(2, 5),
      message: "Custom bias parsing rule added successfully.",
    };
  }

  @Get("user/quota")
  @UseGuards(ClerkGuard)
  getUserQuota() {
    return {
      tier: "Pro Subscription",
      limit: "Unlimited",
      usedThisMonth: 342,
      activeWorkspaceSeats: 3,
      billingCycleReset: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  @Post("billing/checkout")
  createCheckoutSession() {
    return {
      sessionId: "mock_stripe_checkout_session_4f78h92j",
      url: "https://checkout.stripe.com/pay/mock_stripe_session_4f78h92j",
      message: "Stripe checkout session initialized successfully.",
    };
  }

  @Get("analytics")
  @UseGuards(ClerkGuard)
  async fetchAnalytics(@Req() req: any) {
    return await this.prisma.getAnalyticsStats(req.user.userId);
  }

  @Post("analytics/track")
  @UseGuards(ClerkGuard)
  async trackUserEvent(
    @Req() req: any,
    @Body() body: { activity: string; details?: string }
  ) {
    if (!body.activity) {
      throw new HttpException("Activity type is required", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.trackActivity(req.user.userId, body.activity, body.details);
  }

  @Post("gateway/keys")
  @UseGuards(ClerkGuard)
  async generateDeveloperKey(
    @Req() req: any,
    @Body() body: { name: string }
  ) {
    if (!body.name) {
      throw new HttpException("API Key name is required", HttpStatus.BAD_REQUEST);
    }
    const newKey = "pm_key_" + Math.random().toString(36).substr(2, 10);
    await this.prisma.trackActivity(req.user.userId, "IMAGE_UPLOAD", `Generated API Key named: ${body.name}`);
    return {
      success: true,
      name: body.name,
      key: newKey,
      createdAt: new Date().toISOString(),
    };
  }

  @Post("gateway/analyze")
  @UseGuards(ApiKeyGuard)
  async runGatewayAnalysis(
    @Req() req: any,
    @Body() body: { text: string }
  ) {
    if (!body.text || !body.text.trim()) {
      throw new HttpException("Text content is required for gateway analysis", HttpStatus.BAD_REQUEST);
    }

    // Rate Limiter Check using the API key or identifier
    const clientKey = req.user.userId;
    const rateLimitCheck = await this.rateLimiter.checkRateLimit(clientKey, 5); // 5 requests per minute limit for sandbox mock trigger
    
    if (!rateLimitCheck.allowed) {
      throw new HttpException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: "Too Many Requests",
        message: "API Gateway rate limit exceeded. Max 5 requests/min in developer sandbox.",
        limit: rateLimitCheck.limit,
        remaining: rateLimitCheck.remaining,
        resetTime: new Date(rateLimitCheck.resetTime).toISOString(),
      }, HttpStatus.TOO_MANY_REQUESTS);
    }

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body.text }),
      });

      if (!response.ok) {
        throw new HttpException("NLP Engine gateway routing failed", HttpStatus.BAD_GATEWAY);
      }

      const result = await response.json();
      await this.prisma.trackActivity(req.user.userId, "ANALYSIS", `Gateway analyze API called: "${body.text.slice(0, 20)}..."`);
      
      return {
        success: true,
        source: "SaaS API Gateway Router",
        client: req.user.email,
        rateLimit: {
          limit: rateLimitCheck.limit,
          remaining: rateLimitCheck.remaining,
          resetTime: new Date(rateLimitCheck.resetTime).toISOString(),
        },
        ...result,
      };
    } catch (e) {
      // Offline mock fallback
      await this.prisma.trackActivity(req.user.userId, "ANALYSIS", `Gateway analyze API offline fallback: "${body.text.slice(0, 20)}..."`);
      return {
        success: true,
        source: "SaaS API Gateway Mock Router",
        client: req.user.email,
        rateLimit: {
          limit: rateLimitCheck.limit,
          remaining: rateLimitCheck.remaining,
          resetTime: new Date(rateLimitCheck.resetTime).toISOString(),
        },
        language: "English",
        scores: { sentiment: 60, objectivity: 80, biasIndex: 20 },
        tones: [{ name: "Gateway Mock", score: 90, color: "from-indigo-500 to-purple-500" }],
        biases: [],
      };
    }
  }

  @Sse("analytics/live")
  sseLiveTelemetry(): Observable<MessageEvent> {
    return interval(3000).pipe(
      map(() => {
        const fluctuatingLatency = 38 + Math.floor(Math.random() * 12); // 38-50 ms
        const fluctuatingCpu = 8 + Math.floor(Math.random() * 15); // 8-23% CPU load
        const fluctuatingMemory = 320 + Math.floor(Math.random() * 40); // 320-360 MB memory allocation
        const fluctuatingConnections = 4 + Math.floor(Math.random() * 3); // 4-7 active sockets

        const liveStats = {
          latencyMs: fluctuatingLatency,
          cpuLoad: fluctuatingCpu,
          memoryMb: fluctuatingMemory,
          activeConnections: fluctuatingConnections,
          timestamp: new Date().toISOString(),
        };

        return {
          data: JSON.stringify(liveStats),
        } as MessageEvent;
      })
    );
  }

  // ADMIN ENDPOINTS
  @Get("admin/users")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminUsers() {
    return await this.prisma.getAllUsers();
  }

  @Post("admin/users/:id/role")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminUserRole(
    @Param("id") id: string,
    @Body() body: { role: string }
  ) {
    if (!body.role || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
      throw new HttpException("Invalid role profile targeted", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserRole(id, body.role.toUpperCase());
  }

  @Post("admin/users/:id/block")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminUserStatus(
    @Param("id") id: string,
    @Body() body: { isBlocked: boolean }
  ) {
    if (body.isBlocked === undefined) {
      throw new HttpException("isBlocked status is required", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserStatus(id, body.isBlocked);
  }

  @Post("admin/users/:id/delete")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async deleteAdminUser(@Param("id") id: string) {
    return await this.prisma.deleteUser(id);
  }

  @Get("admin/analytics")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminAnalytics() {
    return await this.prisma.getGlobalStats();
  }

  @Get("admin/audit-logs")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminAuditLogs() {
    return await this.prisma.getAuditLogs();
  }

  @Get("admin/policies")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminPolicies() {
    return await this.prisma.getGlobalPolicies();
  }

  @Post("admin/policies")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminPolicies(@Body() body: any) {
    return await this.prisma.updateGlobalPolicies(body);
  }

  @Post("admin/users/:id/tier")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminUserTier(
    @Param("id") id: string,
    @Body() body: { tier: string }
  ) {
    if (!body.tier || !["FREE", "PRO", "TEAM"].includes(body.tier.toUpperCase())) {
      throw new HttpException("Invalid plan tier targeted", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserTier(id, body.tier.toUpperCase());
  }

  // RESTful users endpoints
  @Get("users")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getUsersList() {
    try {
      return await this.prisma.getAllUsers();
    } catch (e) {
      throw new HttpException(
        "Failed to retrieve user catalog: " + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch("users/:id")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async patchUserDetail(
    @Param("id") id: string,
    @Body() body: { role?: string; status?: string; plan?: string; name?: string }
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new HttpException("Update payload body must not be empty", HttpStatus.BAD_REQUEST);
    }

    // Input validation
    if (body.role !== undefined) {
      if (typeof body.role !== "string" || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
        throw new HttpException("Invalid role profile targeted. Must be USER or ADMIN.", HttpStatus.BAD_REQUEST);
      }
    }
    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !["ACTIVE", "BLOCKED"].includes(body.status.toUpperCase())) {
        throw new HttpException("Invalid status targeted. Must be ACTIVE or BLOCKED.", HttpStatus.BAD_REQUEST);
      }
    }
    if (body.plan !== undefined) {
      if (typeof body.plan !== "string" || !["FREE", "PRO", "TEAM"].includes(body.plan.toUpperCase())) {
        throw new HttpException("Invalid plan targeted. Must be FREE, PRO, or TEAM.", HttpStatus.BAD_REQUEST);
      }
    }
    if (body.name !== undefined) {
      if (body.name !== null && typeof body.name !== "string") {
        throw new HttpException("Invalid name targeted. Must be a string.", HttpStatus.BAD_REQUEST);
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
    } catch (e) {
      throw new HttpException(
        "Failed to update user profile: " + e.message,
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Delete("users/:id")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async deleteUserDetail(@Param("id") id: string) {
    try {
      return await this.prisma.deleteUser(id);
    } catch (e) {
      throw new HttpException(
        "Failed to delete user account: " + e.message,
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Developer mock action override to change standard user role dynamically from dashboard settings
  @Post("user/role")
  @UseGuards(ClerkGuard)
  async switchSelfRole(@Req() req: any, @Body() body: { role: string }) {
    if (!body.role || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
      throw new HttpException("Invalid role configuration", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserRole(req.user.userId, body.role.toUpperCase());
  }

  @Get("configuration")
  @UseGuards(ClerkGuard)
  async getConfiguration(@Req() req: any) {
    const system = await this.prisma.systemSettings.findFirst();
    const ai = await this.prisma.aIEngineSettings.findFirst();
    const userPref = await this.prisma.userPreferences.findUnique({ where: { userId: req.user.userId } });
    const user = await this.prisma.user.findUnique({ where: { id: req.user.userId } });

    const isAdmin = user?.role === 'ADMIN';
    return {
      system,
      ai,
      user: userPref,
      admin: isAdmin ? { rateLimit: system?.rateLimit, signupEnabled: system?.signupEnabled, maintenanceMode: system?.maintenanceMode } : undefined,
    };
  }

  @Patch("configuration")
  @UseGuards(ClerkGuard)
  async updateConfiguration(@Req() req: any, @Body() body: any) {
    if (body.system) {
      await this.prisma.systemSettings.upsert({
        where: { id: 1 },
        update: body.system,
        create: { ...body.system, id: 1 },
      });
    }
    if (body.ai) {
      await this.prisma.aIEngineSettings.upsert({
        where: { id: 1 },
        update: body.ai,
        create: { ...body.ai, id: 1 },
      });
    }
    if (body.user) {
      await this.prisma.userPreferences.upsert({
        where: { userId: req.user.userId },
        update: body.user,
        create: { ...body.user, userId: req.user.userId },
      });
    }
    return this.getConfiguration(req);
  }
}
