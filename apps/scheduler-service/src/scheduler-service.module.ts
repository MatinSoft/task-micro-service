import { Module } from '@nestjs/common';
import { SchedulerServiceController } from './scheduler-service.controller';
import { SchedulerServiceService } from './scheduler-service.service';
import { SchedulerKafkaListener } from './scheduler-listener.controller';
import { SchedulerWsListener } from './scheduler-ws-listener.controller';
import { SharedSocketModule } from 'lib/shared-socket/shared-socket.module';

@Module({
  imports: [SharedSocketModule.forRoot({ mode: "client", serverUrl: "http://localhost:4000" })],
  controllers: [SchedulerServiceController],
  providers: [SchedulerServiceService, SchedulerWsListener, SchedulerKafkaListener]
})
export class SchedulerServiceModule { }
