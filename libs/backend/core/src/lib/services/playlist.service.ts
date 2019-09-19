import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '@sdj/backend/config';
import {
  Channel,
  QueuedTrack,
  QueuedTrackRepository,
  Track,
  TrackRepository
} from '@sdj/backend/db';
import { PlaylistType, QueueTrackCommand } from '../..';
import { CqrsServiceFacade } from './cqrs-service.facade';
import { AppServiceFacade } from './app-service.facade';

@Injectable()
export class PlaylistService {
  type: PlaylistType = PlaylistType.radio;
  index: number = 10;
  list: Track[] = [];

  constructor(
    private readonly cqrsServiceFacade: CqrsServiceFacade,
    private readonly appServiceFacade: AppServiceFacade,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async getNext(channel: Channel): Promise<QueuedTrack | undefined> {
    const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue(
      channel.id
    );
    if (queuedTrack) {
      return queuedTrack;
    } else {
      switch (this.type) {
        case PlaylistType.mostPlayed:
          return this.getNextForMostPlayed(channel);
        case PlaylistType.topRated:
          return this.getNextForTopRated(channel);
        case PlaylistType.radio:
        default:
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
          break;
      }
    }
  }

  async getNextForMostPlayed(
    channel: Channel
  ): Promise<QueuedTrack | undefined> {
    if (!this.list.length) {
      this.list = await this.trackRepository.findWeeklyMostPlayedTracks(
        channel.id,
        0,
        10
      );
    }
    this.index--;
    if (this.index < 0) {
      this.type = PlaylistType.radio;
      return;
    }
    this.appServiceFacade.pozdro(channel.id, 'Numer ' + (this.index + 1));
    return this.queuedTrackRepository.queueTrack(
      this.list[this.index],
      channel
    );
  }

  async getNextForTopRated(channel: Channel): Promise<QueuedTrack | undefined> {
    if (!this.list.length) {
      this.list = await this.trackRepository.findWeeklyTopRatedTracks(
        channel.id,
        0,
        10
      );
    }
    this.index--;
    if (this.index < 0) {
      this.type = PlaylistType.radio;
      return;
    }
    this.appServiceFacade.pozdro(channel.id, 'Numer ' + (this.index + 1));
    return this.queuedTrackRepository.queueTrack(
      this.list[this.index],
      channel
    );
  }

  removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
    return this.queuedTrackRepository.remove(queuedTrack);
  }
}
