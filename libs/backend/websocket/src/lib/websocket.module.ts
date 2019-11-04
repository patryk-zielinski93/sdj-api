import { Module } from '@nestjs/common';
import { CoreModule } from '@sdj/backend/core';
import { WebSocketController } from './controllers/websocket.controller';
import { Gateway } from './gateway';

@Module({
  imports: [CoreModule],
  controllers: [WebSocketController],
  providers: [Gateway],
  exports: [Gateway]
})
export class WebSocketModule {}
