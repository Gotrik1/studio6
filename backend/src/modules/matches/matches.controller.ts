
import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { MatchStatus } from '@prisma/client';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

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
  @ApiQuery({ name: 'status', enum: MatchStatus, required: false })
  findAll(@Query('status') status?: MatchStatus) {
    return this.matchesService.findAll({ status });
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

  @Post(':id/resolve')
  resolveDispute(@Param('id') id: string, @Body() resolveDisputeDto: ResolveDisputeDto) {
      return this.matchesService.resolveDispute(id, resolveDisputeDto);
  }
}
