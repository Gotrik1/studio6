import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { kafka, producerConfig } from "./kafka.config";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  public isConnected = false;

  constructor() {
    this.kafka = kafka;
    this.producer = this.kafka.producer(producerConfig);
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

  async produce(topic: string, message: Record<string, unknown>) {
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
