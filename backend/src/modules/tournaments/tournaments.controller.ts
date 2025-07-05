
import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { RegisterTeamDto } from './dto/register-team.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createTournamentDto: CreateTournamentDto, @Req() req: Request) {
    const organizerId = (req.user as any).userId;
    return this.tournamentsService.create(createTournamentDto, organizerId);
  }

  @Post(':id/start')
  start(@Param('id') id: string) {
    return this.tournamentsService.startTournament(id);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'game', required: false, description: 'Фильтр по названию игры' })
  findAll(@Query('game') game?: string) {
    return this.tournamentsService.findAll({ game });
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.tournamentsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Post(':id/register')
  registerTeam(
    @Param('id') tournamentId: string,
    @Body() registerTeamDto: RegisterTeamDto,
  ) {
    return this.tournamentsService.registerTeam(
      tournamentId,
      registerTeamDto.teamId,
    );
  }
}
