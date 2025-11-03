import { Inject, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { TaskEvents } from "lib/shared-socket/events";
import * as communicationInterface from "lib/shared-socket/communication/communication.interface";
import { TaskServiceService } from "./task-service.service";


@WebSocketGateway()
export class TaskWsListener  {

  constructor(
    private readonly taskServiceService: TaskServiceService
  ) {}

  @SubscribeMessage(TaskEvents.SCHEDULE_UPDATE)
  async handleUpdateTask(@MessageBody() message: communicationInterface.IScheduleMessage): Promise<void> {
    await this.taskServiceService.updateTask(message.id, { status: message.status })
  }



}