import { Controller, Get, Param } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AchievementDto } from './dto/achievement.dto';

@ApiTags('Achievements')
@Controller('users/:userId/achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить достижения пользователя' })
  @ApiResponse({ status: 200, description: 'Список достижений.', type: [AchievementDto] })
  findAllForUser(@Param('userId') userId: string) {
    return this.achievementsService.findAllForUser(userId);
  }
}
