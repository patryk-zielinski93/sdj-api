import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '@sdj/backend/config';
import { Channel, QueuedTrack, QueuedTrackRepository, Track, TrackRepository, UserRepository } from '@sdj/backend/db';

import { PlaylistType, QueueTrackCommand } from '../..';
import { TellEvent } from '../cqrs/events/tell.event';


@Injectable()
export class PlaylistService {
  type: PlaylistType = PlaylistType.radio;
  index = 10;
  list: Track[] = [];

  constructor(
    private readonly commandBus: CommandBus,
    private readonly publisher: EventBus,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository
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
            return this.commandBus.execute(
              new QueueTrackCommand(randTrack.id, channel.id, undefined, true)
            );
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
    this.publisher.publish(new TellEvent('Numer ' + (this.index + 1)));
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
    this.publisher.publish(new TellEvent('Numer ' + (this.index + 1)));
    return this.queuedTrackRepository.queueTrack(
      this.list[this.index],
      channel
    );
  }

  removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
    return this.queuedTrackRepository.remove(queuedTrack);
  }
}
