
import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { LeaderboardTeamDto } from './dto/leaderboard-team.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { SetHomePlaygroundDto } from './dto/set-home-playground.dto';

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
  @ApiQuery({ name: 'game', required: false, description: 'Фильтр по названию игры' })
  getLeaderboard(@Query('game') game?: string): Promise<LeaderboardTeamDto[]> {
    return this.teamsService.getLeaderboard({ game });
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':teamId/home-playground')
  setHomePlayground(
    @Param('teamId') teamId: string,
    @Body() setHomePlaygroundDto: SetHomePlaygroundDto,
    @Req() req: Request,
  ) {
    const captainId = (req.user as any).userId;
    return this.teamsService.setHomePlayground(
      teamId,
      setHomePlaygroundDto.playgroundId,
      captainId,
    );
  }
}
