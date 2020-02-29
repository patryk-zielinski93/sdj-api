import { Injectable } from '@nestjs/common';
import { Channel, QueuedTrack } from '@sdj/backend/radio/core/domain';
import {
  QueuedTrackDomainRepository,
  TrackDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import { appConfig } from '@sdj/backend/shared/config';
import { QueueTrackCommand } from './commands/queue-track/queue-track.command';
import { RadioFacade } from './radio.facade';

@Injectable()
export class PlaylistService {
  constructor(
    private radioFacade: RadioFacade,
    private trackRepository: TrackDomainRepository,
    private queuedTrackRepository: QueuedTrackDomainRepository
  ) {}

  async getNext(channel: Channel): Promise<QueuedTrack | undefined> {
    const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue(
      channel.id
    );
    if (queuedTrack) {
      return queuedTrack;
    } else {
      const tracksInDb = await this.trackRepository.countTracks(channel.id);
      if (tracksInDb >= appConfig.trackLengthToStartOwnRadio) {
        const randTrack = await this.trackRepository.getRandomTrack(channel.id);
        if (randTrack) {
          const newQueuedTrack = await this.radioFacade.queueTrack(
            new QueueTrackCommand(randTrack.id, channel.id, undefined, true)
          );
          return this.queuedTrackRepository.findOneOrFail(newQueuedTrack.id);
        }
      }
    }
  }

  removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
    return this.queuedTrackRepository.remove(queuedTrack);
  }
}
