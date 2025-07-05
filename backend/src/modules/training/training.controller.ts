import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { TrainingService } from './training.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Training')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Public()
  @Get('exercises')
  @ApiOperation({ summary: 'Получить список всех упражнений' })
  findAllExercises() {
    return this.trainingService.findAllExercises();
  }

  @Public()
  @Get('exercises/:id')
  @ApiOperation({ summary: 'Получить упражнение по ID' })
  findOneExercise(@Param('id') id: string) {
    return this.trainingService.findOneExercise(id);
  }

  @Public()
  @Get('programs')
  @ApiOperation({ summary: 'Получить список всех программ тренировок' })
  findAllPrograms() {
    return this.trainingService.findAllPrograms();
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('log')
  @ApiOperation({ summary: 'Получить журнал тренировок для текущего пользователя' })
  getTrainingLog(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.trainingService.getLogsForUser(userId);
  }
}
