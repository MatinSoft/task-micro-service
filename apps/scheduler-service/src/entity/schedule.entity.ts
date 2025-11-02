import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";


export enum ScheduleStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

@Entity("Schedule")
@Index(["taskId"])
export class ScheduleEntity {
    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        type: String,
        required: true
    })
    @IsUUID()
    @Column({ type: "uuid" })
    taskId: string;

    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    @Column({ type: "timestamp with time zone" })
    runAt: Date;



    @ApiProperty({
        enum: ScheduleStatus,
        required: true
    })
    @IsEnum(ScheduleStatus)
    @Column({
        type: "enum",
        enum: ScheduleStatus,
        name:"ScheduleStatus",
        default: ScheduleStatus.SCHEDULED,
    })
    status: ScheduleStatus;

    @ApiProperty({
        type: Number,
        required: true
    })
    @IsNumber()
    @Column({ type: "int", default: 0 })
    retries: number;

    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    @CreateDateColumn({ type: "timestamp with time zone" })
    createdAt: Date;

    @ApiProperty({
        type: Date,
        required: true
    })
    @IsDate()
    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedAt: Date;
}