import { Controller, Get } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import type { Coach } from '@/shared/lib/mock-data/coaches';

@ApiTags('Coaches')
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить список всех тренеров' })
  findAll(): Coach[] {
    return this.coachesService.findAll();
  }
}
