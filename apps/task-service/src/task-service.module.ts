import { Module } from '@nestjs/common';
import { TaskServiceController } from './task-service.controller';
import { TaskServiceService } from './task-service.service';
import { MyTypeOrmModule } from './infrastructure/typeorm/typeorm.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TaskRepositoryProvider } from './infrastructure/repo-provider';
import { resolve } from 'path';
import { VersioningConfigService } from './utils/config/versioning-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), "apps", "task-service", '.env')
    }),
    MyTypeOrmModule,
    PrismaModule
  ],
  controllers: [TaskServiceController],
  providers: [TaskServiceService, TaskRepositoryProvider, VersioningConfigService],
})
export class TaskServiceModule { }
