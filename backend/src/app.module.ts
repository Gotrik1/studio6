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
import { FriendsModule } from './modules/friends/friends.module';
import { ChatModule } from './modules/chat/chat.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StoreModule } from './modules/store/store.module';
import { TrainingModule } from './modules/training/training.module';

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
    FriendsModule,
    ChatModule,
    KafkaModule,
    RabbitMQModule,
    NotificationsModule,
    StoreModule,
    TrainingModule,
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
