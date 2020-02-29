import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler
} from '@nestjs/cqrs';
import {
  DeleteQueuedTrackCommand,
  DownloadTrackCommand,
  RadioFacade
} from '@sdj/backend/radio/core/application-services';
import { PlayQueuedTrackEvent } from '../../../../../../radio/core/application-services/src/lib/events/play-queued-track/play-queued-track.event';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';

@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler
  implements ICommandHandler<DownloadAndPlayCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly radioFacade: RadioFacade
  ) {}

  async execute(command: DownloadAndPlayCommand): Promise<void> {
    const track = command.queuedTrack.track;
    return this.radioFacade
      .downloadTrack(new DownloadTrackCommand(track.id))
      .then(
        async () => {
          await this.eventBus.publish(
            new PlayQueuedTrackEvent(command.queuedTrack.id)
          );
        },
        () => {
          this.radioFacade.deleteQueuedTrack(
            new DeleteQueuedTrackCommand(command.queuedTrack.id)
          );
        }
      );
  }
}
