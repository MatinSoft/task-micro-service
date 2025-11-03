import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AttachmentEntity } from "./attachment.entity";

export enum TaskStatus {
  PENDING="PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}
@Entity("Task")
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    id: string

    @Column({ nullable: false })
    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    title: string

    @Column({ nullable: true })
    @ApiProperty({
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string

    @Column({ type: 'enum', enum: TaskStatus })
    @ApiProperty({
        enum: TaskStatus,
        example: [TaskStatus.COMPLETED, TaskStatus.PENDING , TaskStatus.CANCELLED , TaskStatus.IN_PROGRESS ]
    })
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus

    @CreateDateColumn()
    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    createdAt: Date

    @UpdateDateColumn()
    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    updatedAt: Date

    @OneToMany(() => AttachmentEntity, (attachment) => attachment.task)
    attachments: AttachmentEntity[];
}
