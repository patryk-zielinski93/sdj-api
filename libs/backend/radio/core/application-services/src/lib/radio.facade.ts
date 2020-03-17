import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';

import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import { AddTrackToQueueCommand } from './commands/add-track-to-queue/add-track-to-queue.command';
import { DeleteQueuedTrackCommand } from './commands/delete-queued-track/delete-queued-track.command';
import { DownloadAndPlayCommand } from './commands/download-and-play/download-and-play.command';
import { DownloadTrackCommand } from './commands/download-track/download-track.command';
import { FuckYouCommand } from './commands/fuck-you/fuck-you.command';
import { HeartCommand } from './commands/heart/heart.command';
import { PlayNextTrackOrSilenceCommand } from './commands/play-next-track-or-silence/play-next-track-or-silence.command';
import { QueueTrackCommand } from './commands/queue-track/queue-track.command';
import { SkipQueuedTrackCommand } from './commands/skip-queued-track/skip-queued-track.command';
import { ThumbDownCommand } from './commands/thumb-down/thumb-down.command';
import { ThumbUpCommand } from './commands/thumb-up/thumb-up.command';
import { PozdroEvent } from './events/pozdro/pozdro.event';

@Injectable()
export class RadioFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private eventBus: EventBus
  ) {}

  deleteQueuedTrack(command: DeleteQueuedTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  downloadAndPlay(command: DownloadAndPlayCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  downloadTrack(command: DownloadTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  fuckYou(command: FuckYouCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  getNextSong(command: PlayNextTrackOrSilenceCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  heart(command: HeartCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  playTrack(command: AddTrackToQueueCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  pozdro(event: PozdroEvent): void {
    return this.eventBus.publish(event);
  }

  queueTrack(command: QueueTrackCommand): Promise<QueuedTrack> {
    return this.commandBus.execute(command);
  }

  skipQueuedTrack(command: SkipQueuedTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  thumbDown(command: ThumbDownCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  thumbUp(command: ThumbUpCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }
}
