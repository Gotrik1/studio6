
import { Module, Global } from "@nestjs/common";
import { KafkaService } from "./kafka.service";
import { ChatConsumer } from "./consumers/chat.consumer";
import { WebsocketsModule } from "../websockets/websockets.module";

@Global()
@Module({
  imports: [WebsocketsModule],
  providers: [KafkaService, ChatConsumer],
  exports: [KafkaService],
})
export class KafkaModule {}
