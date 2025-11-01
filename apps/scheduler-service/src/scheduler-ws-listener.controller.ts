import { OnModuleInit } from "@nestjs/common";
import { MessageBody, WebSocketGateway } from "@nestjs/websockets";
import { WsClientService } from "lib/shared-socket/communication/ws/ws-clientService";
import { TaskEvents } from "lib/shared-socket/events";

@WebSocketGateway()
export class SchedulerWsListener implements OnModuleInit {

  constructor(private readonly wsClientService: WsClientService) { }

  onModuleInit() {
    this.wsClientService.subscribe(TaskEvents.UPDATED, this.handleUpdateTask)
    this.wsClientService.subscribe(TaskEvents.CREATED, this.handleCreateTask)
    this.wsClientService.subscribe(TaskEvents.DELETED, this.handleDeleteTask)
  }

  handleCreateTask(@MessageBody() message: any): void {
    console.log('Received message:', message);
  }

  handleUpdateTask(@MessageBody() message: any): void {
    console.log('Received message:', message);
  }

  handleDeleteTask(@MessageBody() message: any): void {
    console.log('Received message:', message);
  }

}