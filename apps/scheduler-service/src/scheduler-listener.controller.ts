import { Injectable } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TaskEvents } from "lib/shared-socket/events";

@Injectable()
export class SchedulerKafkaListener {
    @EventPattern(TaskEvents.CREATED)
    async handleTaskCreated(@Payload() data: any) {

    }

    @EventPattern(TaskEvents.UPDATED)
    async handleTaskEdited(@Payload() data: any) {

    }

    @EventPattern(TaskEvents.DELETED)
    async handleTaskDeleted(@Payload() data: any) {

    }

}