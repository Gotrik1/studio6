import { Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import type { RedisClientOptions } from "redis";

@Module({
  imports: [
    NestCacheModule.register<RedisClientOptions>({
      isGlobal: true,
      // In a real application, you would use a Redis store
      // store: redisStore,
      // url: process.env.REDIS_URL,
      // ttl: 300, // 5 minutes
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
