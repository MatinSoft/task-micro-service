import { Module } from '@nestjs/common';
import { SharedEventsGateway } from './base.gateway';
import { ConfigModule } from '@nestjs/config';
import { WsCommunication } from './communication/ws.communication';
import { KafkaCommunication } from './communication/kafka.communication';
import { CommunicationProvider } from './communication/communication.provider';
import { resolve } from 'path';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), "libs", "shared-socket", '.env')
    }),],
  providers: [
    SharedEventsGateway,
    WsCommunication,
    CommunicationProvider,
    KafkaCommunication
  ],
  exports: [SharedEventsGateway,
    WsCommunication,
    CommunicationProvider,
    KafkaCommunication],
})
export class SharedSocketModule { }
