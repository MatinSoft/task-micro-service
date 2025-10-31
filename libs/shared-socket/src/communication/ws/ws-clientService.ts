// libs/shared-socket/src/communication/ws-client.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { CommunicationStrategy } from '../communication.interface';


@Injectable()
export class WsClientService implements CommunicationStrategy, OnModuleInit, OnModuleDestroy {
  private socket: Socket;
  private handlers = new Map<string, (payload: any) => Promise<void> | void>();
  private isConnected = false;
  private readonly serverUrl: string

  constructor() {
    this.serverUrl = 'http://localhost:4000'
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log(`Connected to WebSocket server: ${this.serverUrl}`);
        resolve();
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        reject(error);
      });

      // Listen for all events and route to handlers
      this.socket.onAny((eventName: string, payload: any) => {
        if (this.handlers.has(eventName)) {
          const handler = this.handlers.get(eventName);
         if(handler) {
            handler(payload);
         }
        }
        console.log(eventName , payload)
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 5000);
    });
  }

  async publish(eventName: string, payload: any): Promise<void> {
    if (!this.isConnected) {
      throw new Error('WebSocket client not connected');
    }
    console.log(`Client publishing event: ${eventName}`, payload);
    this.socket.emit(eventName, payload);
  }

  subscribe(eventName: string, handler: (payload: any) => Promise<void> | void): void {
    this.handlers.set(eventName, handler);
    console.log(`Client subscribed to event: ${eventName}`);
  }

  async onModuleDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}