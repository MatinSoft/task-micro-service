import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsCommunication } from './ws/ws.communication';
import { KafkaCommunication } from './kafka.communication';
import { WssGateway } from './ws/ws.gateway';

export const CommunicationProvider: Provider = {
  provide: 'CommunicationStrategy',
  useFactory: (configService: ConfigService, ws: WsCommunication, kafka: KafkaCommunication, shg: WssGateway) => {
    const mode = configService.get<string>('COMM_MODE');
    if (mode === 'kafka') {
      return new KafkaCommunication(configService);
    }
    // default or mode = 'ws'
    return new WsCommunication(shg);
  },
  inject: [ConfigService, WsCommunication, KafkaCommunication, WssGateway],
};