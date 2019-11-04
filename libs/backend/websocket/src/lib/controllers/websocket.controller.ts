import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { MicroservicePattern } from '@sdj/backend/shared/domain';
import { LoggerService } from '@sdj/backend/shared/logger';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Gateway } from '../gateway';

@Controller()
export class WebSocketController {
  tmp: number = Math.floor(Math.random() * 10) || 0;
  constructor(
    private readonly logger: LoggerService,
    private readonly gateway: Gateway
  ) {}

  @MessagePattern(MicroservicePattern.pozdro)
  pozdro(data: { channelId: string; text: string }): void {
    this.gateway.server.in(data.channelId).emit('pozdro', {
      message: data.text
    });
  }

  @EventPattern(MicroservicePattern.playDj)
  playDj(channelId: string): void {
    this.logger.log('dj', channelId);
    this.gateway.server.in(channelId).emit(WebSocketEvents.playDj);
  }

  @EventPattern(MicroservicePattern.playSilence)
  playRadio(channelId: string): void {
    this.logger.log('radio', channelId);
    this.gateway.server.in(channelId).emit(WebSocketEvents.playRadio);
  }
}
