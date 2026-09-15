import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { RedisStore, type RedisReply } from 'rate-limit-redis';
import { redisClient } from '../../lib/redis';
import type { Request, Response } from 'express';

//RATE limits by plan
const PLAN_LIMITS = {
    free: { max: 100, windowMs: 15 * 60 * 1000 }, // 100req/ 15min
    pro: { max: 500, windowMs: 15 * 60 * 1000 }, // 500req / 15min
    enterprise: { max: 2000, windowMs: 15 * 60 * 1000 } //2000req / 15min
}

function createTenantRateLimiter(plan: keyof typeof PLAN_LIMITS = 'free') {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free

    return rateLimit({
        windowMs: limits.windowMs,
        limit: limits.max,
        //key = tenant_id from verified JWT -NOT the IP Address
        keyGenerator: (req: Request) => {
            if(req.user?.tenantId){
                return `tenant:${req.user.tenantId}`
            }
            return `ip:${ipKeyGenerator(req.ip ?? 'unknown')}`

        },
        store: new RedisStore({
            sendCommand: async (...args: [command: string, ...args: (string | Buffer | number)[]]): Promise<RedisReply> => {
                //cost the returned promise as a promise of RedisReply
                return (await redisClient.call(...args)) as RedisReply
            }
        }),
        handler: (req: Request, res: Response) => {
            res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil(limits.windowMs / 1000)
            })
        }

    })
}

const defaultLimiter = createTenantRateLimiter('free');

export const rateLimiter = {
    defaultLimiter,
    createTenantRateLimiter,

}