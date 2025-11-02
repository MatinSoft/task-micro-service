import { Injectable } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { TaskServiceService } from "apps/task-service/src/task-service.service";
import { KafkaCommunication, TaskEvents } from "lib/shared-socket";
import * as communicationInterface from "lib/shared-socket/communication/communication.interface";

@Injectable()
export class TaskTaskKafkaListener {

  constructor(private readonly kafkaCommunication: KafkaCommunication,
    private readonly taskServiceService: TaskServiceService

  ) {
    this.handleTaskEdited = this.handleTaskEdited.bind(this);
  }

  onModuleInit() {
    this.kafkaCommunication.subscribe(TaskEvents.SCHEDULE_UPDATE, this.handleTaskEdited)
    this.kafkaCommunication.assignHandlers()
  }


  async handleTaskEdited(@Payload() data: communicationInterface.IScheduleMessage) {
    await this.taskServiceService.updateTask(data.id, { status: data.status })
  }



}