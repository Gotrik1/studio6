import { Injectable } from '@nestjs/common';
import { coachesList, type Coach } from '@/shared/lib/mock-data/coaches';

@Injectable()
export class CoachesService {
  findAll(): Coach[] {
    // In a real app, this would fetch from a database.
    return coachesList;
  }
}
