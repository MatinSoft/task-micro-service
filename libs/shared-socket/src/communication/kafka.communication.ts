import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CommunicationStrategy } from './communication.interface';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaCommunication implements CommunicationStrategy, OnModuleInit, OnModuleDestroy {
    private enabled: boolean;
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;
    private subscriptions: { topic: string, handler: (payload: any) => Promise<any> }[] = [];
    private isConsumerRunning = false;

    constructor(private config: ConfigService) {
        this.enabled = this.config.get<string>('COMM_MODE') === 'kafka';
        if (!this.enabled) {
            return;
        }

        this.kafka = new Kafka({ brokers: [this.config.get<string[]>('KAFKA_BROKERS')?.toString() || "localhost:9092"] });
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

    async assignHandlers() {
        if (!this.enabled) {
            return;
        }
        // Subscribe to all topics registered
        for (const { topic } of this.subscriptions) {
            await this.consumer.subscribe({ topic, fromBeginning: true });
        }

        if (!this.isConsumerRunning) {
            this.isConsumerRunning = true;
            await this.consumer.run({
                eachMessage: async ({ topic, message }) => {
                    const payload = message.value ? JSON.parse(message.value.toString()) : null;
                    for (const { topic: t, handler } of this.subscriptions) {
                        if (t === topic) {
                            await handler(payload);
                        }
                    }
                },
            });
        }
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
        this.subscriptions.push({ topic: eventName, handler: async (p) => handler(p) });
    }

    async onModuleDestroy() {
        if (!this.enabled) {
            return;
        }
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }
}
