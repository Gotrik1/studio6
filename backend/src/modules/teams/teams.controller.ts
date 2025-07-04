
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { LeaderboardTeamDto } from './dto/leaderboard-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get('leaderboard')
  getLeaderboard(): Promise<LeaderboardTeamDto[]> {
    return this.teamsService.getLeaderboard();
  }
  
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.teamsService.findBySlug(slug);
  }

  @Post(':id/join')
  join(@Param('id') teamId: string, @Body() joinTeamDto: JoinTeamDto) {
    return this.teamsService.joinTeam(teamId, joinTeamDto.userId);
  }
}
