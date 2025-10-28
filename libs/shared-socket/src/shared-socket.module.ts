import { Module } from '@nestjs/common';
import { SharedSocketService } from './shared-socket.service';

@Module({
  providers: [SharedSocketService],
  exports: [SharedSocketService],
})
export class SharedSocketModule {}
