import { Module } from '@nestjs/common';
import { SchedulerServiceController } from './scheduler-service.controller';
import { SchedulerServiceService } from './scheduler-service.service';
import { SchedulerKafkaListener } from './scheduler-listener.controller';
import { SchedulerWsListener } from './scheduler-ws-listener.controller';
import { SharedSocketModule } from 'lib/shared-socket/shared-socket.module';
import { WsClientService } from 'lib/shared-socket/communication/ws/ws-clientService';

@Module({
  imports: [],
  controllers: [SchedulerServiceController ],
  providers: [SchedulerServiceService , SchedulerWsListener , SchedulerKafkaListener , WsClientService],
})
export class SchedulerServiceModule {}
