import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { KafkaModule } from '../kafka/kafka.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [KafkaModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
