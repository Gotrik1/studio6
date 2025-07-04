import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly logger = new Logger(ChatService.name);
  private kafka: Kafka;

  constructor(private readonly chatGateway: ChatGateway) {
    this.kafka = new Kafka({
      clientId: 'prodvor-chat-consumer',
      brokers: (process.env.KAFKA_BROKERS || 'kafka:9092').split(','),
    });
  }

  async onModuleInit() {
    const consumer = this.kafka.consumer({ groupId: 'chat-group' });
    
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });
      this.logger.log('Kafka Consumer for chat connected and subscribed.');

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if (!message.value) return;
          const payload = JSON.parse(message.value.toString());
          this.logger.log(`Received message from Kafka: ${JSON.stringify(payload)}`);
          this.chatGateway.broadcastMessage(payload);
        },
      });
    } catch(error) {
        this.logger.error('Failed to connect Kafka consumer', error);
    }
  }
}
