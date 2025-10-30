import { Injectable } from '@nestjs/common';
import { CommunicationStrategy } from './communication.interface';
import { SharedEventsGateway } from '../base.gateway';

@Injectable()
export class WsCommunication implements CommunicationStrategy {
    constructor(private readonly gateway: SharedEventsGateway) { }

    async publish(eventName: string, payload: any): Promise<void> {
        this.gateway.emitEvent(eventName, payload);
    }

    subscribe(eventName: string, handler: (payload: any) => any): void {
        this.gateway.server.on(eventName, handler);
    }
}