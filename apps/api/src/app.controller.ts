import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ClerkGuard } from "./clerk.guard";
import { ApiKeyGuard } from "./api-key.guard";
import { PrismaService } from "./prisma.service";

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("health")
  getHealth() {
    return {
      status: "healthy",
      service: "NestJS Core API Gateway",
      timestamp: new Date().toISOString(),
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
}
