import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { AppService } from "./app.service";
import { RateLimiterService } from "./rate-limiter.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService, RateLimiterService],
})
export class AppModule {}
