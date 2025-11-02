import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { Column } from 'typeorm';
import { TaskStatus } from '../entity/task.entity';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {


    @Column({ type: 'enum', enum: TaskStatus })
    @ApiProperty({
        enum: TaskStatus,
        example: [TaskStatus.COMPLETED, TaskStatus.PENDING, TaskStatus.CANCELLED, TaskStatus.IN_PROGRESS]
    })
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    @IsOptional()
    status?: TaskStatus
}