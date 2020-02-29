import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlayQueuedTrackEvent } from '@sdj/backend/radio/core/application-services';
import { QueuedTrackDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { LoggerService } from '@sdj/backend/shared/logger';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Gateway } from '../../gateway';

@EventsHandler(PlayQueuedTrackEvent)
export class WsPlayQueuedTrackHandler
  implements IEventHandler<PlayQueuedTrackEvent> {
  constructor(
    private readonly logger: LoggerService,
    private readonly gateway: Gateway,
    private queuedTrackRepository: QueuedTrackDomainRepository
  ) {}

  async handle(event: PlayQueuedTrackEvent): Promise<void> {
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      event.queuedTrackId
    );
    const channelId = queuedTrack.playedIn.id;
    this.logger.log('dj', channelId);
    this.gateway.server.in(channelId).emit(WebSocketEvents.playDj);
  }
}
