import { Module, Global } from "@nestjs/common";
import { KafkaService } from "./kafka.service";
import { ChatConsumer } from "./consumers/chat.consumer";
import { ChatGateway } from "@/modules/chat/chat.gateway";

@Global()
@Module({
  providers: [KafkaService, ChatConsumer, ChatGateway], // Add ChatGateway here because ChatConsumer needs it
  exports: [KafkaService],
})
export class KafkaModule {}
