import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CommunicationStrategy } from './communication.interface';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaCommunication implements CommunicationStrategy, OnModuleInit, OnModuleDestroy {
    private enabled: boolean;
    private kafka: Kafka
    private producer: Producer
    private consumer: Consumer

    constructor(private config: ConfigService) {
        this.enabled = this.config.get<string>('COMM_MODE') === 'kafka';
        if (!this.enabled) {
            return;
        }

        this.kafka = new Kafka({ brokers: this.config.get<string[]>('KAFKA_BROKERS') || ["localhost:9092"] });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: this.config.get<string>('KAFKA_GROUP_ID') || "app-group" });
    }

    async onModuleInit() {
        if (!this.enabled) {
            return;
        }
        await this.producer.connect();
        await this.consumer.connect();
    }

    async publish(eventName: string, payload: any): Promise<void> {
        if (!this.enabled) {
            return;
        }
        await this.producer.send({ topic: eventName, messages: [{ value: JSON.stringify(payload) }] });
    }

    subscribe(eventName: string, handler: (payload: any) => any): void {
        if (!this.enabled) {
            return;
        }
        this.consumer.subscribe({ topic: eventName, fromBeginning: true })
            .then(() => this.consumer.run({ eachMessage: async ({ message }) => handler(JSON.parse(message.value ? message.value.toString() : "")) }));
    }

    async onModuleDestroy() {
        if (!this.enabled) {
            return;
        }
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }
}
