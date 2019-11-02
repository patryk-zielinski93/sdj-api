import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QueuedTrack } from '@sdj/backend/db';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import {
  CreateTrackCommand,
  DeleteQueuedTrackCommand,
  DownloadTrackCommand,
  FuckYouCommand,
  HeartCommand,
  PlayTrackCommand,
  QueueTrackCommand,
  ThumbDownCommand,
  ThumbUpCommand
} from '../..';

@Injectable()
export class CqrsServiceFacade {
  constructor(
    @Inject(Injectors.CQRSSERVICE) private readonly client: ClientProxy
  ) {
  }

  createTrack(command: CreateTrackCommand): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.createTrack, command)
      .toPromise();
  }

  deleteQueuedTrackCommand(
    command: DeleteQueuedTrackCommand
  ): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.deleteQueuedTrack, command)
      .toPromise();
  }

  downloadTrack(command: DownloadTrackCommand): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.downloadTrack, command)
      .toPromise();
  }

  fuckYou(command: FuckYouCommand): Promise<unknown> {
    return this.client.send(MicroservicePattern.fuckYou, command).toPromise();
  }

  heart(command: HeartCommand): Promise<unknown> {
    return this.client.send(MicroservicePattern.heart, command).toPromise();
  }

  playTrack(command: PlayTrackCommand): Promise<unknown> {
    return this.client.send(MicroservicePattern.playTrack, command).toPromise();
  }

  queueTrack(command: QueueTrackCommand): Promise<QueuedTrack> {
    return this.client
      .send(MicroservicePattern.queueTrack, command)
      .toPromise();
  }

  thumbDown(command: ThumbDownCommand): Promise<unknown> {
    return this.client.send(MicroservicePattern.thumbDown, command).toPromise();
  }

  thumbUp(command: ThumbUpCommand): Promise<unknown> {
    return this.client.send(MicroservicePattern.thumbUp, command).toPromise();
  }
}
