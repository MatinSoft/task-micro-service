import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommunicationProvider } from './communication/communication.provider';
import { KafkaCommunication } from './communication/kafka.communication';
import { WssGateway } from './communication/ws/ws.gateway';
import { WsCommunication } from './communication/ws/ws.communication';
import { WsClientService } from './communication/ws/ws-clientService';
import { resolve } from 'path';


@Global()
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: resolve(process.cwd(), "libs", "shared-socket", '.env')
  })],
})
export class SharedSocketModule {
  static forRoot(options: { mode: 'server' | 'client', serverUrl?: string }): DynamicModule {
    const providers: Provider[] = [
      CommunicationProvider,
      KafkaCommunication,
      WsCommunication,
      WssGateway
    ];
    providers.push({
      provide: WsClientService,
      useFactory: () => new WsClientService(options.serverUrl),
    });
    return {
      module: SharedSocketModule,
      providers,
      exports: [...providers],
    };
  }
}
