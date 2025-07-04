
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      // @ts-ignore - The factory can be async, but types are not up to date
      store: async () => await redisStore({
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
        ttl: 300 // 5 minutes in seconds
      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
