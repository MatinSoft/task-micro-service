import { Provider } from '@nestjs/common';
import { PrismaTaskRepository } from './repositories/prisma/task.repository';
import { TypeOrmTaskRepository } from './repositories/typeOrm/task.repository';

export const TaskRepositoryProvider: Provider = {
  provide: 'ITaskRepository',
  useClass:
    process.env.ORM === 'prisma'
      ? PrismaTaskRepository
      : TypeOrmTaskRepository,
};