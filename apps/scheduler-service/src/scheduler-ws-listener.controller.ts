import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { WsClientService } from "lib/shared-socket/communication/ws/ws-clientService";
import { TaskEvents } from "lib/shared-socket/events";

@WebSocketGateway()
export class SchedulerWsListener implements OnModuleInit {

  constructor(private readonly wsClientService: WsClientService) { }

  onModuleInit() {
    this.wsClientService.subscribe(TaskEvents.UPDATED, this.handleUpdateTask)
  }



  @SubscribeMessage(TaskEvents.CREATED)
  handleCreateTask(@MessageBody() message: any): void {
    console.log('Received message:', message);
  }

  @SubscribeMessage(TaskEvents.UPDATED)
  handleUpdateTask(@MessageBody() message: any): void {
    console.log('Received message:', message);
  }

  @SubscribeMessage(TaskEvents.DELETED)
  handleDeleteTask(@MessageBody() message: any): void {
    console.log('Received message:', message);
  }

}