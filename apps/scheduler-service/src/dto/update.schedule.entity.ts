import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column } from "typeorm";
import { ScheduleStatus } from "../entity/schedule.entity";

export class UpdateScheduleDto {

    @ApiProperty({
        enum: ScheduleStatus,
        required: true,
        example: [ScheduleStatus.COMPLETED, ScheduleStatus.FAILED, ScheduleStatus.IN_PROGRESS, ScheduleStatus.SCHEDULED]
    })
    @IsEnum(ScheduleStatus)
    @Column({
        type: "enum",
        enum: ScheduleStatus,
        default: ScheduleStatus.SCHEDULED,
    })
    status: ScheduleStatus;
}