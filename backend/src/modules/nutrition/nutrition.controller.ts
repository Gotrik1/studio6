import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { CreateFoodLogDto } from './dto/create-food-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Nutrition')
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Public()
  @Get('food-items')
  @ApiOperation({ summary: 'Получить справочник всех продуктов питания' })
  findAllFoodItems() {
    return this.nutritionService.findAllFoodItems();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('log')
  @ApiOperation({ summary: 'Получить дневник питания для текущего пользователя' })
  findUserLog(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.nutritionService.findLogForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('log')
  @ApiOperation({ summary: 'Добавить запись в дневник питания' })
  createLogEntry(@Body() createFoodLogDto: CreateFoodLogDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.nutritionService.createLogEntry(userId, createFoodLogDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('log/:id')
  @ApiOperation({ summary: 'Удалить запись из дневника питания' })
  removeLogEntry(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.nutritionService.deleteLogEntry(id, userId);
  }
}
