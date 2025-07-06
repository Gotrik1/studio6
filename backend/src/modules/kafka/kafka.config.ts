import { Kafka, Partitioners } from 'kafkajs';

/**
 * Централизованная конфигурация для Kafka.
 * Это гарантирует, что и продюсер, и консьюмеры используют одинаковые настройки.
 */

export const KAFKA_CLIENT_ID = 'prodvor-backend';
export const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');

export const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
});

export const producerConfig = {
  createPartitioner: Partitioners.DefaultPartitioner,
};
