import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CqrsServiceFacade,
  DeleteQueuedTrackCommand,
  DownloadTrackCommand
} from '@sdj/backend/core';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';

@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler
  implements ICommandHandler<DownloadAndPlayCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly cqrsServiceFacade: CqrsServiceFacade
  ) {}

  async execute(command: DownloadAndPlayCommand): Promise<void> {
    const track = command.queuedTrack.track;
    return this.cqrsServiceFacade
      .downloadTrack(new DownloadTrackCommand(track.id))
      .then(
        async () => {
          await this.commandBus.execute(
            new PlayQueuedTrackCommand(command.queuedTrack.id)
          );
        },
        () => {
          this.cqrsServiceFacade.deleteQueuedTrackCommand(
            new DeleteQueuedTrackCommand(command.queuedTrack.id)
          );
        }
      );
  }
}
