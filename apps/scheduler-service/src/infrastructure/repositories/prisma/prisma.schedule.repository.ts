import { CreateScheduleEntity } from 'apps/scheduler-service/src/dto/create.schedule.entity';
import { UpdateScheduleDto } from 'apps/scheduler-service/src/dto/update.schedule.entity';
import { ScheduleEntity } from 'apps/scheduler-service/src/entity/schedule.entity';
import { IScheduleRepo } from 'apps/scheduler-service/src/interfaces/schedule.interface';
import { PrismaService } from "../../prisma/prisma.service";

export class SchedulePrismaRepo implements IScheduleRepo {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(prismaSchedule: any): ScheduleEntity {
    const s = new ScheduleEntity();
    s.id = prismaSchedule.id;
    s.taskId = prismaSchedule.taskId;
    s.runAt = prismaSchedule.runAt;
    s.status = prismaSchedule.status as any; // cast to ScheduleStatus
    s.retries = prismaSchedule.retries;
    s.createdAt = prismaSchedule.createdAt;
    s.updatedAt = prismaSchedule.updatedAt;
    return s;
  }

  async create(taskDto: CreateScheduleEntity): Promise<ScheduleEntity> {
    const prismaSchedule = await this.prisma.schedule.create({
      data: {
        taskId: taskDto.taskId,
        runAt: new Date(),
        status: taskDto.status,
        retries: 0,
      },
    });
    return this.toEntity(prismaSchedule);
  }

  async findAll(): Promise<ScheduleEntity[]> {
    const prismaSchedules = await this.prisma.schedule.findMany();
    return prismaSchedules.map(s => this.toEntity(s));
  }

  async findById(id: string): Promise<ScheduleEntity | null> {
    const prismaSchedule = await this.prisma.schedule.findUnique({
      where: { id },
    });
    if (!prismaSchedule) return null;
    return this.toEntity(prismaSchedule);
  }

  async update(id: string, taskDto: UpdateScheduleDto): Promise<ScheduleEntity> {
    const prismaSchedule = await this.prisma.schedule.update({
      where: { id },
      data: {
        ...taskDto,
      },
    });
    return this.toEntity(prismaSchedule);
  }

  async delete(id: string): Promise<ScheduleEntity> {
    const prismaSchedule = await this.prisma.schedule.delete({
      where: { id },
    });
    return this.toEntity(prismaSchedule);
  }
}
