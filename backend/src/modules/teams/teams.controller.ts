
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { LeaderboardTeamDto } from './dto/leaderboard-team.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Public()
  @Get('leaderboard')
  getLeaderboard(): Promise<LeaderboardTeamDto[]> {
    return this.teamsService.getLeaderboard();
  }
  
  @Public()
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.teamsService.findBySlug(slug);
  }

  @Post(':id/join')
  join(@Param('id') teamId: string, @Body() joinTeamDto: JoinTeamDto) {
    return this.teamsService.joinTeam(teamId, joinTeamDto.userId);
  }
}
