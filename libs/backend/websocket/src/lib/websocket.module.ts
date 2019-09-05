import { Module } from '@nestjs/common';
import { CoreModule } from '@sdj/backend/core';
import { WebSocketController } from './controllers/websocket.controller';
import { Gateway } from './gateway';
import { CommonModule } from '@sdj/backend/common';

@Module({
  imports: [CommonModule, CoreModule],
  controllers: [WebSocketController],
  providers: [Gateway],
  exports: [Gateway]
})
export class WebSocketModule {}
