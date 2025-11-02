import { Injectable } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { KafkaCommunication } from "lib/shared-socket/communication/kafka.communication";
import { TaskEvents } from "lib/shared-socket/events";
import { SchedulerServiceService } from "./scheduler-service.service";
import * as communicationInterface from "lib/shared-socket/communication/communication.interface";

@Injectable()
export class SchedulerKafkaListener {

  constructor(private readonly kafkaCommunication: KafkaCommunication,
    private readonly schedulerServiceService: SchedulerServiceService

  ) {
    this.handleTaskCreated = this.handleTaskCreated.bind(this);
    this.handleTaskEdited = this.handleTaskEdited.bind(this);
    this.handleTaskDeleted = this.handleTaskDeleted.bind(this);
  }

  onModuleInit() {
    this.kafkaCommunication.subscribe(TaskEvents.UPDATED, this.handleTaskEdited)
    this.kafkaCommunication.subscribe(TaskEvents.CREATED, this.handleTaskCreated)
    this.kafkaCommunication.subscribe(TaskEvents.DELETED, this.handleTaskDeleted)
    this.kafkaCommunication.assignHandlers()
  }

  async handleTaskCreated(@Payload() data: communicationInterface.ITaskMessage) {
    try {
      const res = await this.schedulerServiceService.create({ taskId: data.id })
      console.log(res, data)
    } catch (error) {
      console.log(error)
    }
  }

  async handleTaskEdited(@Payload() data: communicationInterface.ITaskMessage) {
  }

  async handleTaskDeleted(@Payload() data: communicationInterface.ITaskMessage) {

  }

}