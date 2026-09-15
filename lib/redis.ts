
import Redis from 'ioredis';

export const redisClient = new Redis(6379,process.env.REDIS_URL || 'redis://localhost:6379',{});

redisClient.on('error',(err)=> console.error('Redis Error:', err.message));

