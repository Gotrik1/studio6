import { RabbitMQModule as NestRabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Global, Module } from "@nestjs/common";
import { NotificationsConsumer } from "./consumers/notifications.consumer";
import { NotificationsModule } from "../notifications/notifications.module";
import { PRODVOR_EXCHANGE, RABBITMQ_URI } from "./rabbitmq.config";

@Global()
@Module({
  imports: [
    NestRabbitMQModule.forRoot(NestRabbitMQModule, {
      exchanges: [
        {
          name: PRODVOR_EXCHANGE,
          type: "topic",
        },
      ],
      uri: RABBITMQ_URI,
      connectionInitOptions: { wait: false },
    }),
    NotificationsModule,
  ],
  providers: [NotificationsConsumer],
  exports: [NestRabbitMQModule],
})
export class RabbitMQModule {}
