import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler
} from '@nestjs/cqrs';

import { PlayQueuedTrackEvent } from '../../events/play-queued-track/play-queued-track.event';
import { DownloadAndPlayCommand } from './download-and-play.command';
import { RadioFacade } from '../../radio.facade';
import { DownloadTrackCommand } from '../download-track/download-track.command';
import { DeleteQueuedTrackCommand } from '../delete-queued-track/delete-queued-track.command';

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
