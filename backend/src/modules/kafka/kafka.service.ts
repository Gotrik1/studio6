import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { Kafka, Producer, Partitioners } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  public isConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: "prodvor-backend",
      brokers: (process.env.KAFKA_BROKERS || "kafka:9092").split(","),
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log("Kafka Producer connected successfully.");
    } catch (error) {
      this.logger.error("Failed to connect Kafka Producer", error);
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.logger.log("Kafka Producer disconnected.");
    }
  }

  async produce(topic: string, message: any) {
    if (!this.isConnected) {
      this.logger.warn("Kafka Producer is not connected. Message not sent.");
      return;
    }
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  getClient(): Kafka {
    return this.kafka;
  }
}
