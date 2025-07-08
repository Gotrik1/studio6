import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TeamsModule } from "./teams/teams.module";
import { TournamentsModule } from "./tournaments/tournaments.module";
import { MatchesModule } from "./matches/matches.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AiModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { CacheModule } from "./cache/cache.module";
import { ChallengesModule } from "./challenges/challenges.module";
import { PlaygroundsModule } from "./playgrounds/playgrounds.module";
import { CoachesModule } from "./coaches/coaches.module";
import { SponsorsModule } from "./sponsors/sponsors.module";
import { SponsorshipModule } from "./sponsorship/sponsorship.module";
import { FriendsModule } from "./friends/friends.module";
import { ChatModule } from "./chat/chat.module";
import { KafkaModule } from "./kafka/kafka.module";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { StoreModule } from "./store/store.module";
import { TrainingModule } from "./training/training.module";
import { PromotionsModule } from "./promotions/promotions.module";
import { LeaguesModule } from "./leagues/leagues.module";
import { SportsModule } from "./sports/sports.module";
import { LfgModule } from "./lfg/lfg.module";
import { MeasurementsModule } from "./measurements/measurements.module";
import { TrainingProposalsModule } from "./training-proposals/training-proposals.module";
import { PollsModule } from "./polls/polls.module";
import { QuestsModule } from "./quests/quests.module";
import { InventoryModule } from "./inventory/inventory.module";
import { NutritionModule } from "./nutrition/nutrition.module";
import { FaqModule } from "./faq/faq.module";
import { TournamentAnnouncementsModule } from "./tournament-announcements/tournament-announcements.module";
import { TournamentJudgesModule } from "./tournament-judges/tournament-judges.module";
import { ReportsModule } from "./reports/reports.module";
import { AchievementsModule } from "./achievements/achievements.module";
import { MedicalPartnersModule } from "./medical-partners/medical-partners.module";
import { TournamentMedicalModule } from "./tournament-medical/tournament-medical.module";
import { TournamentParticipantsModule } from "./tournament-participants/tournament-participants.module";
import { TournamentSponsorsModule } from "./tournament-sponsors/tournament-sponsors.module";
import { TeamApplicationsModule } from "./team-applications/team-applications.module";
import { AdminModule } from "./admin/admin.module";
import { FeedModule } from "./feed/feed.module";
import { ActivitiesModule } from "./activities/activities.module";
import { SponsorshipOffersModule } from "./sponsorship-offers/sponsorship-offers.module";
import { WebsocketsModule } from "./websockets/websockets.module";
import { StorageModule } from "./storage/storage.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { PlaygroundReportsModule } from "./playground-reports/playground-reports.module";

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
    ReportsModule,
    AchievementsModule,
    MedicalPartnersModule,
    TournamentMedicalModule,
    TournamentParticipantsModule,
    TournamentSponsorsModule,
    TeamApplicationsModule,
    AdminModule,
    FeedModule,
    ActivitiesModule,
    SponsorshipOffersModule,
    WebsocketsModule,
    StorageModule,
    MonitoringModule,
    PlaygroundReportsModule,
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
