import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Column } from "typeorm";


export class CreateScheduleDto {

    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    @Column({ type: "uuid" })
    taskId: string;

}