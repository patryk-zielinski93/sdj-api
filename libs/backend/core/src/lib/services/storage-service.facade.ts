import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QueuedTrack } from '@sdj/backend/db';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StorageServiceFacade {
  constructor(
    @Inject(Injectors.STORAGESERVICE)
    private readonly client: ClientProxy
  ) {}

  addToQueue(queuedTrack: QueuedTrack): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.addToQueue, queuedTrack)
      .toPromise();
  }

  channelAppears(room: string): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.channelAppear, room)
      .toPromise();
  }

  channelDisappears(room: string): void {
    this.client.send(MicroservicePattern.channelDisappears, room);
  }

  getCurrentTrack(channelId: string): Promise<QueuedTrack | null> {
    return this.client
      .send(MicroservicePattern.getCurrentTrack, channelId)
      .toPromise();
  }

  getSilenceCount(channelId: string): Promise<number> {
    return this.client
      .send(MicroservicePattern.getSilenceCount, channelId)
      .pipe(map(value => +value))
      .toPromise();
  }

  getQueue(channel: string): Observable<QueuedTrack[]> {
    return this.client.send(MicroservicePattern.getQueue, channel);
  }

  removeFromQueue(queuedTrack: QueuedTrack): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.removeFromQueue, queuedTrack)
      .toPromise();
  }

  setCurrentTrack(
    channelId: string,
    queuedTrack: QueuedTrack | null
  ): Promise<unknown> {
    return this.client
      .send(MicroservicePattern.setCurrentTrack, {
        channelId: channelId,
        queuedTrack
      })
      .toPromise();
  }

  setSilenceCount(channelId: any, count: number): void | PromiseLike<void> {
    this.client
      .send(MicroservicePattern.setSilenceCount, {
        channelId: channelId,
        value: count
      })
      .toPromise();
  }
}
