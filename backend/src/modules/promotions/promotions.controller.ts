import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить список всех промо-акций' })
  findAll() {
    return this.promotionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать новую промо-акцию' })
  create(@Body() createPromotionDto: CreatePromotionDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.promotionsService.create({ ...createPromotionDto, organizerId: userId });
  }
}
