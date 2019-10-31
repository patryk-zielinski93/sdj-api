import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '@sdj/backend/config';
import { Channel, QueuedTrack, QueuedTrackRepository, Track, TrackRepository } from '@sdj/backend/db';
import { QueueTrackCommand } from '../cqrs/commands';
import { AppServiceFacade } from './app-service.facade';
import { CqrsServiceFacade } from './cqrs-service.facade';

@Injectable()
export class PlaylistService {
  index: number = 10;
  list: Track[] = [];

  constructor(
    private readonly cqrsServiceFacade: CqrsServiceFacade,
    private readonly appServiceFacade: AppServiceFacade,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {
  }

  async getNext(channel: Channel): Promise<QueuedTrack | undefined> {
    const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue(
      channel.id
    );
    if (queuedTrack) {
      return queuedTrack;
    } else {
      const tracksInDb = await this.trackRepository.countTracks(channel.id);
      if (tracksInDb >= appConfig.trackLengthToStartOwnRadio) {
        const randTrack = await this.trackRepository.getRandomTrack(
          channel.id
        );
        const newQueuedTrack = await this.cqrsServiceFacade.queueTrack(
          new QueueTrackCommand(randTrack.id, channel.id, undefined, true)
        );
        return this.queuedTrackRepository.findOneOrFail(newQueuedTrack.id);
      }
    }
  }

  removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
    return this.queuedTrackRepository.remove(queuedTrack);
  }
}
