import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString, IsUUID } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskEntity } from "./task.entity";

@Entity('Attachment')
export class AttachmentEntity {

    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    id: string

    @Column()
    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    taskId: string

    @Column()
    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    filename: string

    @Column()
    @ApiProperty({
        type: Number,
        required: true
    })
    @IsNumber()
    size: number

    @Column()
    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    mimetype: string


    @CreateDateColumn()
    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    createdAt: Date

    @ManyToOne(() => TaskEntity, (task) => task.attachments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'taskId' })
    task: TaskEntity;
}