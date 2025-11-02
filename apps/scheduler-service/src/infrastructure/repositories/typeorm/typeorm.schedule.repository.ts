// schedule.repository.ts
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { IScheduleRepo } from "apps/scheduler-service/src/interfaces/schedule.interface";
import { ScheduleEntity, ScheduleStatus } from "apps/scheduler-service/src/entity/schedule.entity";
import { CreateScheduleDto } from "apps/scheduler-service/src/dto/create.schedule.entity";
import { UpdateScheduleDto } from "apps/scheduler-service/src/dto/update.schedule.entity";


@Injectable()
export class ScheduleRepository implements IScheduleRepo {

  constructor(private readonly repository: Repository<ScheduleEntity>) { }

  async create(taskDto: CreateScheduleDto): Promise<ScheduleEntity> {
    const entity = this.repository.create({ ...taskDto, status: ScheduleStatus.SCHEDULED });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ScheduleEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<ScheduleEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, schedule: UpdateScheduleDto): Promise<ScheduleEntity> {
    await this.repository.update(id,schedule);
    return this.repository.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<ScheduleEntity> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    await this.repository.remove(entity);
    return entity;
  }

}
