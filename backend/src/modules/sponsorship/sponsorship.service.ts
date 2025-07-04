import { Injectable } from '@nestjs/common';
import { sponsoredTeams, teamsSeekingSponsorship } from '@/shared/lib/mock-data/sponsorship';

@Injectable()
export class SponsorshipService {
  getDashboardData() {
    // In a real app, this would fetch and aggregate data from a database.
    return {
      sponsoredTeams,
      teamsSeekingSponsorship,
    };
  }
}
