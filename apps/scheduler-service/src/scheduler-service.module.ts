import { Module } from '@nestjs/common';
import { SchedulerServiceController } from './scheduler-service.controller';
import { SchedulerServiceService } from './scheduler-service.service';
import { SchedulerKafkaListener } from './scheduler-listener.controller';
import { SchedulerWsListener } from './scheduler-ws-listener.controller';
import { SharedSocketModule } from 'lib/shared-socket/shared-socket.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { VersioningConfigService } from './utils/config/versioning-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), "apps", "scheduler-service", '.env')
    }),
    SharedSocketModule.forRoot({ mode: "client", serverUrl: "http://localhost:4000" })],
  controllers: [SchedulerServiceController],
  providers: [SchedulerServiceService, SchedulerWsListener, SchedulerKafkaListener, VersioningConfigService]
})
export class SchedulerServiceModule { }
