import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as scheduleInterface from './interfaces/schedule.interface';
import * as communicationInterface from 'lib/shared-socket/communication/communication.interface';
import { CreateScheduleDto } from './dto/create.schedule.entity';
import { ScheduleEntity, ScheduleStatus } from './entity/schedule.entity';
import { UpdateScheduleDto } from './dto/update.schedule.entity';
import { TaskEvents } from 'lib/shared-socket';

@Injectable()
export class SchedulerServiceService {
  constructor(@Inject('IScheduleRepository')
  private readonly scheduleRepository: scheduleInterface.IScheduleRepo,
    @Inject('CommunicationStrategy')
    private readonly comm: communicationInterface.CommunicationStrategy,
  ) { }

  async create(createSchedule: CreateScheduleDto): Promise<ScheduleEntity> {
    const newSchedule = await this.scheduleRepository.create(createSchedule)
    return newSchedule
  }

  async findAll(): Promise<ScheduleEntity[]> {
    try {
      return await this.scheduleRepository.findAll()
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleEntity> {

    const foundedSchedule = await this.scheduleRepository.findById(id)

    if (!foundedSchedule) {
      throw new NotFoundException("ScheduleEntity not found")
    }
    const updated = await this.scheduleRepository.update(id, updateScheduleDto)
    this.comm.publish(TaskEvents.SCHEDULE_UPDATE, { id: updated.taskId, status: this.getStatus(updated) })
    return updated
  }

  private getStatus(schedule: ScheduleEntity): string {

    switch (schedule.status) {

      case ScheduleStatus.COMPLETED:
        return "COMPLETED"

      case ScheduleStatus.FAILED:
        return "PENDING"

      case ScheduleStatus.IN_PROGRESS:
        return "IN_PROGRESS"

      case ScheduleStatus.SCHEDULED:
        return "PENDING"

      default:
        return "PENDING"

    }

  }

  async createV2(): Promise<string> {
    return "Schedule V2 Created"
  }

  async delete(id: string): Promise<ScheduleEntity> {
    const foundedSchedule = await this.scheduleRepository.findById(id)

    if (!foundedSchedule) {
      throw new NotFoundException("ScheduleEntity not found")
    }
    return await this.scheduleRepository.delete(id)
  }

  async deleteByTaskId(taskId: string) {

  }
}
