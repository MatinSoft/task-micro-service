
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrismaTaskRepository } from './repositories/prisma/task.repository';
import { TaskEntity } from '../entity/task.entity';
import { TypeOrmTaskRepository } from './repositories/typeOrm/task.repository';
import { PrismaService } from './prisma/prisma.service';
import { AttachmentEntity } from '../entity/attachment.entity';



export const TaskRepositoryProvider: Provider = {
  provide: 'ITaskRepository',
  useFactory: (
    config: ConfigService,
    repo: Repository<TaskEntity>,
    atachRepo: Repository<AttachmentEntity>,
    prismaService: PrismaService
  ) => {
    const orm = config.get<string>('ORM');
    if (orm === 'prisma') {
      return new PrismaTaskRepository(prismaService);
    }
    return new TypeOrmTaskRepository(repo, atachRepo);
  },
  inject: [ConfigService, getRepositoryToken(TaskEntity), getRepositoryToken(AttachmentEntity), PrismaService],
};
