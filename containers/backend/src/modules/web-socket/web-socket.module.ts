import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { Gateway } from './gateway';
import { WebSocketService } from './services/web-socket.service';

@Module({
  imports: [SharedModule],
  providers: [Gateway, WebSocketService],
  exports: [Gateway]
})
export class WebSocketModule {}
