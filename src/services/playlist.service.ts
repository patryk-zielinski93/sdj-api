import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';
import { QueuedTrack } from '../entities/queued-track.model';
import { DbService } from './db.service';

export class PlaylistService {
  private static instance: PlaylistService;

  static getInstance(): PlaylistService {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
  }

  getNext(): Observable<QueuedTrack | undefined> {
    return DbService.getConnection().pipe(
      switchMap(connection => {
        const queuedTrackRepository = connection.getRepository(QueuedTrack);
        return fromPromise(
          queuedTrackRepository.createQueryBuilder('queuedTrack')
            .addSelect('max(queuedTrack.id)')
            .leftJoinAndSelect('queuedTrack.track', 'track')
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

}
