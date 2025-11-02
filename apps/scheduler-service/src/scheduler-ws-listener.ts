import { OnModuleInit } from "@nestjs/common";
import { MessageBody, WebSocketGateway } from "@nestjs/websockets";
import { WsClientService } from "lib/shared-socket/communication/ws/ws-clientService";
import { TaskEvents } from "lib/shared-socket/events";
import { SchedulerServiceService } from "./scheduler-service.service";
import * as communicationInterface from "lib/shared-socket/communication/communication.interface";

@WebSocketGateway()
export class SchedulerWsListener implements OnModuleInit {

  constructor(private readonly wsClientService: WsClientService,
    private readonly schedulerServiceService: SchedulerServiceService
  ) {
    this.handleCreateTask = this.handleCreateTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  onModuleInit() {
    this.wsClientService.subscribe(TaskEvents.UPDATED, this.handleUpdateTask)
    this.wsClientService.subscribe(TaskEvents.CREATED, this.handleCreateTask)
    this.wsClientService.subscribe(TaskEvents.DELETED, this.handleDeleteTask)
  }

  async handleCreateTask(@MessageBody() message: communicationInterface.ITaskMessage): Promise<void> {
    await this.schedulerServiceService.create({ taskId: message.id })
  }

  handleUpdateTask(@MessageBody() message: communicationInterface.ITaskMessage): void {
    console.log('Received message:', message);
  }

  async handleDeleteTask(@MessageBody() message: communicationInterface.ITaskMessage): Promise<void> {
    await this.schedulerServiceService.deleteByTaskId(message.id)
  }

}