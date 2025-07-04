import { Controller, Get } from '@nestjs/common';
import { TrainingService } from './training.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

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
  @Get('programs')
  @ApiOperation({ summary: 'Получить список всех программ тренировок' })
  findAllPrograms() {
    return this.trainingService.findAllPrograms();
  }
}
