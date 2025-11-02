import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column } from "typeorm";
import { ScheduleStatus } from "../entity/schedule.entity";

export class UpdateScheduleDto {

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