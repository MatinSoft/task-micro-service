import { CreateScheduleEntity } from "../dto/create.schedule.entity";
import { UpdateScheduleDto } from "../dto/update.schedule.entity";
import { ScheduleEntity } from "../entity/schedule.entity";

export interface IScheduleRepo {
    create(taskDto: CreateScheduleEntity): Promise<ScheduleEntity>;
    findAll(): Promise<ScheduleEntity[]>;
    findById(id: string): Promise<ScheduleEntity | null>;
    update(id: string, taskDto: UpdateScheduleDto): Promise<ScheduleEntity>;
    delete(id: string): Promise<ScheduleEntity>
}