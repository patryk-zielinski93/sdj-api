import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlaySilenceEvent } from '@sdj/backend/radio/core/application-services';
import { Store } from '@sdj/backend/radio/infrastructure';
import { LoggerService } from '@sdj/backend/shared/logger';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Gateway } from '../../gateway';

@EventsHandler(PlaySilenceEvent)
export class WsPlaySilenceHandler implements IEventHandler<PlaySilenceEvent> {
  constructor(
    private logger: LoggerService,
    private gateway: Gateway,
    private readonly storageService: Store
  ) {}

  async handle(command: PlaySilenceEvent): Promise<void> {
    const channelId = command.channelId;
    let count = await this.storageService.getSilenceCount(channelId);
    count++;
    if (count > 1) {
      this.logger.log('radio', channelId);
      this.gateway.server.in(channelId).emit(WebSocketEvents.playRadio);
    }
  }
}
