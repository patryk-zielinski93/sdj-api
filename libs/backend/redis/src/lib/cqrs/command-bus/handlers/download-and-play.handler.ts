import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PlaylistStore } from '../../../../../../core/src/lib/store/playlist.store';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';
import { DownloadTrackCommand } from '../../../../../../core/src/lib/cqrs/command-bus/commands/download-track.command';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';

@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler
  implements ICommandHandler<DownloadAndPlayCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly storage: PlaylistStore
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
        this.storage.removeFromQueue(command.queuedTrack);
      }
    );
  }
}
