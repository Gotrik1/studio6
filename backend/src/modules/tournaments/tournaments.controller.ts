
import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { RegisterTeamDto } from './dto/register-team.dto';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { MatchStatus } from '@prisma/client';
import { TournamentCrmDto } from './dto/tournament-crm.dto';
import { CreateTournamentMediaDto } from './dto/create-tournament-media.dto';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTournamentDto: UpdateTournamentDto) {
    // In a real app, you'd check if the user is the organizer or an admin
    return this.tournamentsService.update(id, updateTournamentDto);
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
  
  @Get('crm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Список турниров для CRM.', type: [TournamentCrmDto] })
  findAllForCrm(): Promise<TournamentCrmDto[]> {
    return this.tournamentsService.findAllForCrm();
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
  
  @Post(':id/media')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createMedia(@Param('id') tournamentId: string, @Body() createMediaDto: CreateTournamentMediaDto) {
    return this.tournamentsService.addMedia(tournamentId, createMediaDto);
  }
}
