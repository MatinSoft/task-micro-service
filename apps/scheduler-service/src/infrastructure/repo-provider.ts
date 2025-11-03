import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../entity/schedule.entity';
import { SchedulePrismaRepo } from './repositories/prisma/prisma.schedule.repository';
import { ScheduleRepository } from './repositories/typeorm/typeorm.schedule.repository';
import { PrismaService } from './prisma/prisma.service';



export const SchedulerRepositoryProvider: Provider = {
  provide: 'IScheduleRepository',
  useFactory: (
    config: ConfigService,
    repo: Repository<ScheduleEntity>,
    prismaService: PrismaService
  ) => {
    const orm = config.get<string>('ORM');
    if (orm === 'prisma') {
      return new SchedulePrismaRepo(prismaService);
    }
    return new ScheduleRepository(repo);
  },
  inject: [ConfigService, getRepositoryToken(ScheduleEntity), PrismaService],
};
