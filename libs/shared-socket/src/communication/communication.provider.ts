import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WsCommunication } from "./ws/ws.communication";
import { KafkaCommunication } from "./kafka.communication";
import { WssGateway } from "./ws/ws.gateway";
import { WsClientService } from "./ws/ws-clientService";

export const CommunicationProvider: Provider = {
  provide: 'CommunicationStrategy',
  useFactory: (
    config: ConfigService,
    wsComm: WsCommunication,
    kafkaComm: KafkaCommunication,
    wssGw: WssGateway,
    wsClient: WsClientService,
  ) => {
    const mode = config.get<string>('COMM_MODE');
    if (mode === 'kafka') {
      return kafkaComm;
    }
    if (mode === 'client') {
      return wsClient;
    }
    // default to server mode
    return wsComm;
  },
  inject: [
    ConfigService,
    WsCommunication,
    KafkaCommunication,
    WssGateway,
    WsClientService,
  ],
};
