import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WsCommunication } from './communication/ws/ws.communication';
import { KafkaCommunication } from './communication/kafka.communication';
import { CommunicationProvider } from './communication/communication.provider';
import { resolve } from 'path';
import { WssGateway } from './communication/ws/ws.gateway';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), "libs", "shared-socket", '.env')
    }),],
  providers: [
    WssGateway,
    WsCommunication,
    KafkaCommunication,
    CommunicationProvider,
  ],
  exports: [
    "CommunicationStrategy"
  ],
})
export class SharedSocketModule { }
