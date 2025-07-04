import { Injectable } from '@nestjs/common';
import { sponsorsList, type Sponsor } from '@/shared/lib/mock-data/sponsors';

@Injectable()
export class SponsorsService {
  findAll(): Sponsor[] {
    // In a real app, this would fetch from a database.
    return sponsorsList;
  }
}
