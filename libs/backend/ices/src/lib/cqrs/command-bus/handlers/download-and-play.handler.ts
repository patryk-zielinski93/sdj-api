import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DownloadTrackCommand, StorageServiceFacade } from '@sdj/backend/core';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';


@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler
  implements ICommandHandler<DownloadAndPlayCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly storageService: StorageServiceFacade
  ) {}

  async execute(command: DownloadAndPlayCommand): Promise<void> {
    const track = command.queuedTrack.track;
    return this.commandBus.execute(new DownloadTrackCommand(track.id)).then(
      async () => {
        await this.commandBus.execute(
          new PlayQueuedTrackCommand(command.queuedTrack.id)
        );
      },
      () => {
        this.storageService.removeFromQueue(command.queuedTrack);
      }
    );
  }
}
