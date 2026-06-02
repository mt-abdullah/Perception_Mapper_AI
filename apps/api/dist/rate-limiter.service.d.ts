export declare class RateLimiterService {
    private readonly logger;
    private memoryCache;
    private readonly WINDOW_SIZE_MS;
    private readonly DEFAULT_LIMIT;
    checkRateLimit(clientKey: string, limit?: number): Promise<{
        allowed: boolean;
        limit: number;
        remaining: number;
        resetTime: number;
    }>;
}
