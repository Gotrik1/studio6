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
import { PromotionsModule } from './modules/promotions/promotions.module';
import { LeaguesModule } from './modules/leagues/leagues.module';
import { SportsModule } from './modules/sports/sports.module';
import { LfgModule } from './modules/lfg/lfg.module';
import { MeasurementsModule } from './modules/measurements/measurements.module';
import { TrainingProposalsModule } from './modules/training-proposals/training-proposals.module';
import { PollsModule } from './modules/polls/polls.module';
import { QuestsModule } from './modules/quests/quests.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { FaqModule } from './modules/faq/faq.module';
import { TournamentAnnouncementsModule } from './modules/tournament-announcements/tournament-announcements.module';
import { TournamentJudgesModule } from './modules/tournament-judges/tournament-judges.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { MedicalPartnersModule } from './modules/medical-partners/medical-partners.module';
import { TournamentMedicalModule } from './modules/tournament-medical/tournament-medical.module';
import { TournamentParticipantsModule } from './modules/tournament-participants/tournament-participants.module';
import { TournamentSponsorsModule } from './modules/tournament-sponsors/tournament-sponsors.module';
import { TeamApplicationsModule } from './modules/team-applications/team-applications.module';
import { AdminModule } from './modules/admin/admin.module';

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
    PromotionsModule,
    LeaguesModule,
    SportsModule,
    LfgModule,
    MeasurementsModule,
    TrainingProposalsModule,
    PollsModule,
    QuestsModule,
    InventoryModule,
    NutritionModule,
    FaqModule,
    TournamentAnnouncementsModule,
    TournamentJudgesModule,
    TournamentParticipantsModule,
    TournamentSponsorsModule,
    TournamentMedicalModule,
    MedicalPartnersModule,
    ReportsModule,
    AchievementsModule,
    TeamApplicationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
