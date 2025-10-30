import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsCommunication } from './ws.communication';
import { KafkaCommunication } from './kafka.communication';
import { SharedEventsGateway } from '../base.gateway';

export const CommunicationProvider: Provider = {
  provide: 'CommunicationStrategy',
  useFactory: (configService: ConfigService, ws: WsCommunication, kafka: KafkaCommunication, shg: SharedEventsGateway) => {
    const mode = configService.get<string>('COMM_MODE');
    if (mode === 'kafka') {
      return new KafkaCommunication(configService);
    }
    // default or mode = 'ws'
    return new WsCommunication(shg);
  },
  inject: [ConfigService, WsCommunication, KafkaCommunication, SharedEventsGateway],
};