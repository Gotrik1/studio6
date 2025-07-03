import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { MatchesModule } from './modules/matches/matches.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TeamsModule,
    TournamentsModule,
    MatchesModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
