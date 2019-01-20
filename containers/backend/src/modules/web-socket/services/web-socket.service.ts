import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as redis from 'redis';
import { Observable, of, Subject } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { pathConfig } from '../../../configs/path.config';
import { QueuedTrack } from '../../shared/modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../../shared/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../shared/modules/db/repositories/track.repository';
import { UserRepository } from '../../shared/modules/db/repositories/user.repository';
import { Mp3Service } from '../../shared/services/mp3.service';
import { PlaylistService } from '../../shared/services/playlist.service';

@Injectable()
export class WebSocketService {
  private handlingNextSong = false;
  public playDj = new Subject<QueuedTrack>();
  public playRadio = new Subject<void>();
  private redisClient;
  private redisSub;

  constructor(
    private mp3: Mp3Service,
    private playlist: PlaylistService,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(QueuedTrackRepository) private queueTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    this.redisClient = redis.createClient({
      host: 'redis'
    });
    this.redisSub = redis.createClient({
      host: 'redis'
    });

    this.subscribeToRedisGetNext();
  }

  private async subscribeToRedisGetNext(): Promise<void> {

    let count = 0;

    this.redisSub.on('message', (channel, message) => {
      if (this.handlingNextSong) return;
      this.handlingNextSong = true;
      this.playlist.getNext()
        .then(async (queuedTrack: QueuedTrack | undefined) => {
          console.log(channel, message);
          if (queuedTrack) {
            count = 0;
            this.downloadAndPlay(queuedTrack)
              .pipe(finalize(() => this.handlingNextSong = false))
              .subscribe();
          } else {
            count = count + 1;
            this.redisClient.set('next_song', '10-sec-of-silence');
            if (count > 1) {
              this.playRadio.next();
            }
              this.handlingNextSong = false;
          }
        });
    });

    this.redisSub.subscribe('getNext');
  }

  private downloadAndPlay(queuedTrack: QueuedTrack): Observable<null> {
    const track = queuedTrack.track;
    if (!fs.existsSync(pathConfig.tracks + '/' + track.id + '.mp3')) {
      return this.mp3.downloadAndNormalize(track.id)
        .pipe(
          switchMap(() => this.play(queuedTrack))
        );
    } else {
      return this.play(queuedTrack);
    }
  }

  private play(queuedTrack: QueuedTrack): Observable<null> {
    this.redisClient.set('next_song', queuedTrack.track.id);
    this.playDj.next(queuedTrack);
    this.playlist.updateQueuedTrackPlayedAt(queuedTrack);
    return of(null);
  }
}
