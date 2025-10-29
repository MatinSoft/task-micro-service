import { Module } from '@nestjs/common';
import { TaskServiceController } from './task-service.controller';
import { TaskServiceService } from './task-service.service';
import { TaskRepositoryProvider } from './infrastructure/repo-provider';
import { TaskEntity } from './entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaService } from './infrastructure/prisma/prisma.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [TaskEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity])
  ],
  controllers: [TaskServiceController],
  providers: [PrismaService , TaskRepositoryProvider, TaskServiceService],
})
export class TaskServiceModule { }
