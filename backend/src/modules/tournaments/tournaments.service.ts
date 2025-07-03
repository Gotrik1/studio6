import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Injectable()
export class TournamentsService {
  private readonly tournaments = []; // Mock database

  create(createTournamentDto: CreateTournamentDto) {
    // Logic to create a tournament
    return 'This action adds a new tournament';
  }

  findAll() {
    return `This action returns all tournaments`;
  }

  findOne(id: string) {
    return `This action returns a #${id} tournament`;
  }
}
