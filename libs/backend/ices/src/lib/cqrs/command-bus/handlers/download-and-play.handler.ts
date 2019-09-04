import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Store } from '../../../../../../storage/src/lib/services/store';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';
import { DownloadTrackCommand } from '@sdj/backend/core';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';
import { Inject } from '@nestjs/common';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler
  implements ICommandHandler<DownloadAndPlayCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy
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
        this.storageService.send(
          MicroservicePattern.removeFromQueue,
          command.queuedTrack
        );
      }
    );
  }
}
