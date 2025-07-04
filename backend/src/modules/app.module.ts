import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CacheModule } from './cache/cache.module';
import { ChallengesModule } from './challenges/challenges.module';
import { PlaygroundsModule } from './playgrounds/playgrounds.module';
import { CoachesModule } from './coaches/coaches.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';

@Module({
  imports: [
    CacheModule,
    PrismaModule,
    UsersModule,
    TeamsModule,
    TournamentsModule,
    MatchesModule,
    AiModule,
    AuthModule,
    ChallengesModule,
    PlaygroundsModule,
    CoachesModule,
    SponsorsModule,
    SponsorshipModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
