import { RateLimiterRedis } from 'rate-limiter-flexible';
import { StatusCodes } from 'http-status-codes';

class RateLimiterMiddleware {
    constructor({ redisService, logger }) {
        this.logger = logger;
        this.redisService = redisService;
        this.initialize();
    }

    initialize() {
        this.rateLimiter = new RateLimiterRedis({
            keyPrefix: 'rlflx:',
            storeClient: this.redisService.client,
            points: 20,
            duration: 10,
            blockDuration: 60,
        });
    }

    async getClientKey(req) {
        return req.ip;
    }

    generalLimiter() {
        return async (req, res, next) => {
            const key = await this.getClientKey(req);

            try {
                await this.rateLimiter.consume(key);
                next();
            } catch (rejRes) {
                this.logger.warn(`Rate limit exceeded for key: ${key}`);
                res.status(StatusCodes.TOO_MANY_REQUESTS).send('Too Many Requests');
            } 
        }
    }
}

export default RateLimiterMiddleware;