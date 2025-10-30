import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/events' }) 
export class SharedEventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
  }

  emitEvent(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }

  toRoom(room: string, eventName: string, payload: any) {
    this.server.to(room).emit(eventName, payload);
  }
}
