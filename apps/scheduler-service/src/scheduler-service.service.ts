import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as scheduleInterface from './interfaces/schedule.interface';
import * as communicationInterface from 'lib/shared-socket/communication/communication.interface';
import { CreateScheduleDto } from './dto/create.schedule.entity';
import { ScheduleEntity } from './entity/schedule.entity';
import { UpdateScheduleDto } from './dto/update.schedule.entity';

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
    return await this.scheduleRepository.findAll()
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleEntity> {

    const foundedSchedule = await this.scheduleRepository.findById(id)

    if (!foundedSchedule) {
      throw new NotFoundException("ScheduleEntity not found")
    }
    return await this.scheduleRepository.update(id, updateScheduleDto)
  }

  async createV2(): Promise<string> {
    return "Schedule V2 Created"
  }
}
