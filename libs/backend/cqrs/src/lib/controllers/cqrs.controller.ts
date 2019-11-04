import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import {
  CreateTrackCommand,
  DeleteQueuedTrackCommand,
  DeleteTrackCommand,
  DownloadTrackCommand,
  FuckYouCommand,
  HeartCommand,
  PlayTrackCommand,
  QueueTrackCommand,
  ThumbDownCommand,
  ThumbUpCommand
} from '@sdj/backend/core';
import { QueuedTrack } from '@sdj/backend/db';
import { MicroservicePattern } from '@sdj/backend/shared/domain';

@Controller()
export class CqrsController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(MicroservicePattern.createTrack)
  createTrack(command: CreateTrackCommand): Promise<unknown> {
    return this.commandBus.execute(
      new CreateTrackCommand(command.id, command.addedBy)
    );
  }

  @MessagePattern(MicroservicePattern.deleteTrack)
  deleteTrack(command: DeleteTrackCommand): Promise<unknown> {
    return this.commandBus.execute(new DownloadTrackCommand(command.trackId));
  }

  @MessagePattern(MicroservicePattern.deleteQueuedTrack)
  deleteQueuedTrack(command: DeleteQueuedTrackCommand): Promise<unknown> {
    return this.commandBus.execute(
      new DeleteQueuedTrackCommand(command.queuedTrackId)
    );
  }

  @MessagePattern(MicroservicePattern.downloadTrack)
  downloadTrack(command: DownloadTrackCommand): Promise<unknown> {
    return this.commandBus.execute(new DownloadTrackCommand(command.trackId));
  }

  @MessagePattern(MicroservicePattern.fuckYou)
  fuckYou(command: FuckYouCommand): Promise<unknown> {
    return this.commandBus.execute(
      new FuckYouCommand(command.queuedTrackId, command.userId)
    );
  }

  @MessagePattern(MicroservicePattern.heart)
  heart(command: HeartCommand): Promise<unknown> {
    return this.commandBus.execute(
      new HeartCommand(command.queuedTrackId, command.userId)
    );
  }

  @MessagePattern(MicroservicePattern.playTrack)
  playTrack(command: PlayTrackCommand): Promise<unknown> {
    // TODO Change to Exception filter decorator
    return this.commandBus
      .execute(
        new PlayTrackCommand(command.link, command.channelId, command.addedById)
      )
      .catch(err => {
        throw new RpcException(err.message);
      });
  }

  @MessagePattern(MicroservicePattern.queueTrack)
  queueTrack(command: QueueTrackCommand): Promise<QueuedTrack> {
    return this.commandBus
      .execute(
        new QueueTrackCommand(
          command.trackId,
          command.channelId,
          command.addedBy,
          command.randomized
        )
      )
      .catch(err => {
        throw new RpcException(err.message);
      });
  }

  @MessagePattern(MicroservicePattern.thumbDown)
  thumbDown(command: ThumbDownCommand): Promise<unknown> {
    return this.commandBus.execute(
      new ThumbDownCommand(command.queuedTrackId, command.userId)
    );
  }

  @MessagePattern(MicroservicePattern.thumbUp)
  thumbUp(command: ThumbUpCommand): Promise<unknown> {
    return this.commandBus.execute(
      new ThumbUpCommand(command.queuedTrackId, command.userId)
    );
  }
}
