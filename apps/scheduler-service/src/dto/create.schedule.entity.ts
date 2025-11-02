import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";
import { Column } from "typeorm";
import { ScheduleStatus } from "../entity/schedule.entity";

export class CreateScheduleEntity {

    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    @Column({ type: "uuid" })
    taskId: string;

    @ApiProperty({
        enum: ScheduleStatus,
        required: true
    })
    @IsEnum(ScheduleStatus)
    @Column({
        type: "enum",
        enum: ScheduleStatus,
        default: ScheduleStatus.SCHEDULED,
    })
    status: ScheduleStatus;

}