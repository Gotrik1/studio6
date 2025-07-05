import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TournamentAnnouncementsService } from './tournament-announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Tournaments')
@Controller('tournaments/:tournamentId/announcements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentAnnouncementsController {
  constructor(private readonly service: TournamentAnnouncementsService) {}

  @Get()
  findAll(@Param('tournamentId') tournamentId: string) {
    return this.service.findAllForTournament(tournamentId);
  }

  @Post()
  create(
    @Param('tournamentId') tournamentId: string,
    @Req() req: Request,
    @Body() dto: CreateAnnouncementDto,
  ) {
    const userId = (req.user as any).userId;
    return this.service.create(tournamentId, userId, dto);
  }
}
