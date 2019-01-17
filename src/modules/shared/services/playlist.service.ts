import { Injectable } from '@nestjs/common';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { DbService } from './db.service';

@Injectable()
export class PlaylistService {

  constructor(private db: DbService) {
  }

  getNext(): Observable<QueuedTrack | undefined> {
    return DbService.getConnection().pipe(
      switchMap(connection => {
        const queuedTrackRepository = connection.getRepository(QueuedTrack);
        return fromPromise(
          queuedTrackRepository.createQueryBuilder('queuedTrack')
            // .addSelect('max(queuedTrack.id)')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .andWhere('queuedTrack.playedAt IS NULL')
            .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
            .getOne()
        );
      })
    );
  }

  removeQueuedTrack(queuedTrack: QueuedTrack): Observable<QueuedTrack> {
    return DbService.getRepository(QueuedTrack).pipe(
      switchMap(repository => fromPromise(repository.remove(queuedTrack)))
    );
  }

  /**
   * Update playedAt in database to current or provided time
   * @param {QueuedTrack} queuedTrack
   * @param {Date} [playedAt]
   * @returns {Observable<QueuedTrack>}
   */
  updateQueuedTrackPlayedAt(queuedTrack: QueuedTrack, playedAt?: Date): Observable<QueuedTrack> {
    queuedTrack.playedAt = playedAt || new Date();

    return DbService.getRepository(QueuedTrack).pipe(
      switchMap(repository => fromPromise(repository.save(queuedTrack)))
    );
  }
}
