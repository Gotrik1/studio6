
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { Request } from 'express';

@ApiTags('Chat')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список чатов для текущего пользователя' })
  async getUserChats(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.chatService.findUserChats(userId);
  }

  @Get(':chatId/history')
  @ApiOperation({ summary: 'Получить историю сообщений для чата' })
  async getChatHistory(@Param('chatId') chatId: string) {
    return this.chatService.getHistory(chatId);
  }
}
