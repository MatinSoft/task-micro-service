import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { CommunicationStrategy } from '../communication.interface';

@Injectable()
export class WsClientService implements CommunicationStrategy, OnModuleInit, OnModuleDestroy {
  private socket: Socket;
  private handlers = new Map<string, (payload: any) => any>();
  private isConnected = false;
  constructor(private readonly serverUrl: string = "http://localhost:4000") { }

  async onModuleInit() {
    setTimeout(async () => {
      await this.connect();
    }, 1500)
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl, { transports: ['websocket', 'polling'] });
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log("sock connected")
        resolve();
      });
      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });
      this.socket.onAny((eventName: string, payload: any) => {
        const handler = this.handlers.get(eventName);
        if (handler) {
          handler(payload);
        }
      });
      this.socket.on('connect_error', (err) => reject(err));

      setTimeout(() => {
        if (!this.isConnected) reject(new Error('Timeout connecting WS client'));
      }, 5000);
    });
  }

  async publish(eventName: string, payload: any): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Client not connected');
    }
    this.socket.emit(eventName, payload);
  }

  subscribe(eventName: string, handler: (payload: any) => any): void {
    this.handlers.set(eventName, handler);
  }

  async onModuleDestroy() {
    this.socket?.disconnect();
  }
}
