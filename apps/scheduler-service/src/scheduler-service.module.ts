import { Module } from '@nestjs/common';
import { SchedulerServiceController } from './scheduler-service.controller';
import { SchedulerServiceService } from './scheduler-service.service';
import { SchedulerKafkaListener } from './scheduler-listener.controller';
import { SchedulerWsListener } from './scheduler-ws-listener';
import { SharedSocketModule } from 'lib/shared-socket/shared-socket.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { VersioningConfigService } from './utils/config/versioning-config.service';
import { SchedulerRepositoryProvider } from './infrastructure/repo-provider';
import { MyTypeOrmModule } from './infrastructure/typeorm/typeorm.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), "apps", "scheduler-service", '.env')
    }),
    MyTypeOrmModule,
    PrismaModule,
    SharedSocketModule.forRoot({ mode: "client", serverUrl: process.env.WS_server || "http://localhost:4000" })
  ],
  controllers: [SchedulerServiceController],
  providers: [SchedulerServiceService, SchedulerWsListener, SchedulerRepositoryProvider, SchedulerKafkaListener, VersioningConfigService]
})
export class SchedulerServiceModule { }
