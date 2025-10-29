import { ApiProperty } from "@nestjs/swagger"
import { TaskStatus } from "@prisma/client"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class TaskEntity {

    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    id: string

    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    title: string


    @ApiProperty({
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        enum: TaskStatus,
        example: [TaskStatus.COMPLETED, TaskStatus.PENDING]
    })
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus

    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    createdAt: Date

    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    updatedAt: Date
}
