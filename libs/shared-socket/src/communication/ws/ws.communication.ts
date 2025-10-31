import { Injectable } from '@nestjs/common';
import { CommunicationStrategy } from '../communication.interface';
import { WssGateway } from './ws.gateway';

@Injectable()
export class WsCommunication implements CommunicationStrategy {
    constructor(private readonly gateway: WssGateway) { }

    async publish(eventName: string, payload: any): Promise<void> {
        this.gateway.emitEvent(eventName, payload);
    }

    subscribe(eventName: string, handler: (payload: any) => any): void {
        this.gateway.server.on(eventName, handler);
    }
}