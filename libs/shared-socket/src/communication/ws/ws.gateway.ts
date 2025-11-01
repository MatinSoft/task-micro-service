import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';



@WebSocketGateway() 
export class WssGateway implements OnGatewayInit {

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WS Gateway initialized');
  }

  emitEvent(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }

  toRoom(room: string, eventName: string, payload: any) {
    this.server.to(room).emit(eventName, payload);
  }

}
