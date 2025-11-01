import { Injectable } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { TaskEvents } from "lib/shared-socket/events";

@Injectable()
export class SchedulerKafkaListener {
    @EventPattern(TaskEvents.CREATED)
    async handleTaskCreated(@Payload() data: any) {

    }

    @MessagePattern(TaskEvents.UPDATED)
    async handleTaskEdited(@Payload() data: any) {
        console.log("kafka", data)
    }

    @EventPattern(TaskEvents.DELETED)
    async handleTaskDeleted(@Payload() data: any) {

    }

}