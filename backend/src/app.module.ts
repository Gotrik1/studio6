import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { MatchesModule } from './modules/matches/matches.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CacheModule } from './modules/cache/cache.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { PlaygroundsModule } from './modules/playgrounds/playgrounds.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { SponsorsModule } from './modules/sponsors/sponsors.module';
import { SponsorshipModule } from './modules/sponsorship/sponsorship.module';

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
