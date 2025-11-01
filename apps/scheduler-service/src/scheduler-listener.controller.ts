import { Injectable } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { KafkaCommunication } from "lib/shared-socket/communication/kafka.communication";
import { TaskEvents } from "lib/shared-socket/events";

@Injectable()
export class SchedulerKafkaListener {

    constructor(private readonly kafkaCommunication: KafkaCommunication) { }

    onModuleInit() {
        this.kafkaCommunication.subscribe(TaskEvents.UPDATED, this.handleTaskEdited)
        this.kafkaCommunication.subscribe(TaskEvents.CREATED, this.handleTaskCreated)
        this.kafkaCommunication.subscribe(TaskEvents.DELETED, this.handleTaskDeleted)
    }

    async handleTaskCreated(@Payload() data: any) {

    }

    async handleTaskEdited(@Payload() data: any) {
        console.log("kafka", data)
    }

    async handleTaskDeleted(@Payload() data: any) {

    }

}