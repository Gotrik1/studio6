
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }
  
  @Public()
  @Get('match-of-the-week')
  findMatchOfTheWeek() {
    return this.matchesService.findMatchOfTheWeek();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id/score')
  updateScore(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.updateScore(id, updateMatchDto);
  }
}
