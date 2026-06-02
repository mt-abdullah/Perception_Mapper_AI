"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterService = void 0;
const common_1 = require("@nestjs/common");
let RateLimiterService = class RateLimiterService {
    constructor() {
        this.logger = new common_1.Logger("RateLimiterService");
        this.memoryCache = new Map();
        this.WINDOW_SIZE_MS = 60 * 1000;
        this.DEFAULT_LIMIT = 60;
    }
    async checkRateLimit(clientKey, limit = this.DEFAULT_LIMIT) {
        const now = Date.now();
        if (!this.memoryCache.has(clientKey)) {
            this.memoryCache.set(clientKey, []);
        }
        const requestTimes = this.memoryCache.get(clientKey);
        const cutoffTime = now - this.WINDOW_SIZE_MS;
        const activeRequests = requestTimes.filter(t => t > cutoffTime);
        const count = activeRequests.length;
        const isRateLimited = count >= limit;
        if (!isRateLimited) {
            activeRequests.push(now);
            this.memoryCache.set(clientKey, activeRequests);
        }
        else {
            this.logger.warn(`Client key ${clientKey} exceeded rate limits: ${count}/${limit} req/min`);
        }
        const remaining = Math.max(0, limit - activeRequests.length);
        const resetTime = now + this.WINDOW_SIZE_MS;
        return {
            allowed: !isRateLimited,
            limit,
            remaining,
            resetTime,
        };
    }
};
exports.RateLimiterService = RateLimiterService;
exports.RateLimiterService = RateLimiterService = __decorate([
    (0, common_1.Injectable)()
], RateLimiterService);
//# sourceMappingURL=rate-limiter.service.js.map