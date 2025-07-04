import { RabbitMQModule as NestRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    NestRabbitMQModule.forRoot(NestRabbitMQModule, {
      exchanges: [
        {
          name: 'prodvor_exchange',
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [NestRabbitMQModule],
})
export class RabbitMQModule {}
