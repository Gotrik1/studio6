
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { RegisterTeamDto } from './dto/register-team.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Post(':id/start')
  start(@Param('id') id: string) {
    return this.tournamentsService.startTournament(id);
  }

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

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
