import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ScheduleStatus } from "../entity/schedule.entity";

export class UpdateScheduleDto {

    @ApiProperty({
        enum: ScheduleStatus,
        required: true,
        example: [ScheduleStatus.COMPLETED, ScheduleStatus.FAILED, ScheduleStatus.IN_PROGRESS, ScheduleStatus.SCHEDULED]
    })
    @IsEnum(ScheduleStatus)
    status?: ScheduleStatus;
}