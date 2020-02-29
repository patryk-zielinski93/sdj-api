import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';

import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import { CreateTrackCommand } from './commands/create-track/create-track.command';
import { DeleteQueuedTrackCommand } from './commands/delete-queued-track/delete-queued-track.command';
import { DeleteTrackCommand } from './commands/delete-track/delete-track.command';
import { DownloadTrackCommand } from './commands/download-track/download-track.command';
import { FuckYouCommand } from './commands/fuck-you/fuck-you.command';
import { HeartCommand } from './commands/heart/heart.command';
import { PlayTrackCommand } from './commands/play-track/play-track.command';
import { QueueTrackCommand } from './commands/queue-track/queue-track.command';
import { ThumbDownCommand } from './commands/thumb-down/thumb-down.command';
import { ThumbUpCommand } from './commands/thumb-up/thumb-up.command';
import { PozdroEvent } from './events/pozdro/pozdro.event';

@Injectable()
export class RadioFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private eventBus: EventBus
  ) {}

  createTrack(command: CreateTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  deleteTrack(command: DeleteTrackCommand): Promise<unknown> {
    return this.commandBus.execute(new DownloadTrackCommand(command.trackId));
  }

  deleteQueuedTrack(command: DeleteQueuedTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  downloadTrack(command: DownloadTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  fuckYou(command: FuckYouCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  heart(command: HeartCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  playTrack(command: PlayTrackCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  queueTrack(command: QueueTrackCommand): Promise<QueuedTrack> {
    return this.commandBus.execute(command);
  }

  thumbDown(command: ThumbDownCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  thumbUp(command: ThumbUpCommand): Promise<unknown> {
    return this.commandBus.execute(command);
  }

  pozdro(event: PozdroEvent) {
    this.eventBus.publish(event);
  }
}
