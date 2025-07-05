import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateStatusActivityDto } from './dto/create-status-activity.dto';

@ApiTags('Activities')
@Controller('activities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Получить ленту активности' })
  getFeed() {
    return this.activitiesService.getFeed();
  }

  @Post('status')
  @ApiOperation({ summary: 'Опубликовать новый статус' })
  postStatus(@Body() createStatusDto: CreateStatusActivityDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.activitiesService.createStatusPost(userId, createStatusDto.text);
  }
}
