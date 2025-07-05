import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { PlaygroundsService } from './playgrounds.service';
import { CreatePlaygroundDto } from './dto/create-playground.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Playgrounds')
@Controller('playgrounds')
export class PlaygroundsController {
  constructor(private readonly playgroundsService: PlaygroundsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую площадку' })
  create(@Body() createPlaygroundDto: CreatePlaygroundDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.playgroundsService.create(createPlaygroundDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить список одобренных площадок' })
  findAll() {
    return this.playgroundsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить площадку по ID' })
  findOne(@Param('id') id: string) {
    return this.playgroundsService.findOne(id);
  }

  @Public()
  @Get(':id/reviews')
  @ApiOperation({ summary: 'Получить отзывы для площадки' })
  findReviews(@Param('id') id: string) {
      return this.playgroundsService.findReviews(id);
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оставить отзыв о площадке' })
  createReview(@Param('id') id: string, @Body() dto: CreateReviewDto, @Req() req: Request) {
      const userId = (req.user as any).userId;
      return this.playgroundsService.addReview(id, userId, dto);
  }

  // --- Admin Routes ---
  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все площадки (для админки)' })
  findAllForAdmin() {
    return this.playgroundsService.findAllForAdmin();
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Одобрить площадку (для админки)' })
  approve(@Param('id') id: string) {
    return this.playgroundsService.approve(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить площадку (для админки)' })
  remove(@Param('id') id: string) {
    return this.playgroundsService.remove(id);
  }
}
