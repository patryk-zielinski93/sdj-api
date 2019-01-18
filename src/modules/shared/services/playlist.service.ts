import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs/internal/Observable';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../modules/db/repositories/queued-track.repository';

@Injectable()
export class PlaylistService {

  constructor(@InjectRepository(QueuedTrackRepository)
              private queuedTrackRepository: QueuedTrackRepository) {
  }

  getNext(): Observable<QueuedTrack | undefined> {
    return fromPromise(
      this.queuedTrackRepository.getNextSongToPlay()
    );
  }

  removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
    return this.queuedTrackRepository.remove(queuedTrack);
  }

  /**
   * Update playedAt in database to current or provided time
   * @param {QueuedTrack} queuedTrack
   * @param {Date} [playedAt]
   * @returns {Observable<QueuedTrack>}
   */
  updateQueuedTrackPlayedAt(queuedTrack: QueuedTrack, playedAt?: Date): Promise<QueuedTrack> {
    queuedTrack.playedAt = playedAt || new Date();

    return this.queuedTrackRepository.save(queuedTrack);
  }
}
