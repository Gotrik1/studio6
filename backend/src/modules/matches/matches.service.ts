import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchesService {
  private readonly matches = []; // Mock database

  create(createMatchDto: CreateMatchDto) {
    // Logic to create a match
    return 'This action adds a new match';
  }

  findAll() {
    return `This action returns all matches`;
  }

  findOne(id: string) {
    return `This action returns a #${id} match`;
  }
}
