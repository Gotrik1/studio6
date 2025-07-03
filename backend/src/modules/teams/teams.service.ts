import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  private readonly teams = []; // Mock database

  create(createTeamDto: CreateTeamDto) {
    // Logic to create a team
    return 'This action adds a new team';
  }

  findAll() {
    return `This action returns all teams`;
  }

  findOne(id: string) {
    return `This action returns a #${id} team`;
  }
}
