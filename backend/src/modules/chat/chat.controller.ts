
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId/history')
  @ApiOperation({ summary: 'Получить историю сообщений для чата' })
  async getChatHistory(@Param('chatId') chatId: string) {
    return this.chatService.getHistory(chatId);
  }
}
