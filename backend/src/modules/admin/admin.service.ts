import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TournamentsService } from "../tournaments/tournaments.service";
import { MatchesService } from "../matches/matches.service";
import { MatchStatus, Tournament } from "@prisma/client";

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tournamentsService: TournamentsService,
    private readonly matchesService: MatchesService,
  ) {}

  async getDashboardStats() {
    const [totalUsers, allTournaments, disputedMatches] = await Promise.all([
      this.usersService.count(),
      this.tournamentsService.findAll(),
      this.matchesService.findAll({ status: MatchStatus.DISPUTED }),
    ]);

    const activeTournaments = (allTournaments as Tournament[]).filter(
      (t) => t.status === "ONGOING" || t.status === "REGISTRATION",
    ).length;

    const openTickets = disputedMatches.length;

    // Revenue is still mocked as there is no payment logic
    const monthlyRevenue = "$5,230";

    return {
      totalUsers,
      activeTournaments,
      openTickets,
      monthlyRevenue,
    };
  }
}
