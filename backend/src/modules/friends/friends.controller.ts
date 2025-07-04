
import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список друзей' })
  findAll() {
    return this.friendsService.findAll();
  }

  @Get('requests')
  @ApiOperation({ summary: 'Получить входящие запросы в друзья' })
  findRequests() {
      return this.friendsService.findRequests();
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Получить рекомендации друзей' })
  findSuggestions() {
      return this.friendsService.findSuggestions();
  }

  // Mock endpoints for mutations
  @Post('requests/:id/accept')
  @ApiOperation({ summary: 'Принять запрос в друзья (мок)' })
  acceptRequest(@Param('id') id: string) {
      return { message: `Request ${id} accepted.` };
  }

  @Delete('requests/:id')
  @ApiOperation({ summary: 'Отклонить запрос в друзья (мок)' })
  declineRequest(@Param('id') id: string) {
      return { message: `Request ${id} declined.` };
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить друга (мок)' })
  removeFriend(@Param('id') id: string) {
      return { message: `Friend ${id} removed.` };
  }

  @Post('suggestions/:id')
  @ApiOperation({ summary: 'Отправить запрос другу из рекомендаций (мок)' })
  addSuggestedFriend(@Param('id') id: string) {
       return { message: `Friend request sent to suggested user ${id}.` };
  }
}
