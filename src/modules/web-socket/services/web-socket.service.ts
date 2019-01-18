import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as redis from 'redis';
import { Subject } from 'rxjs';
import { appConfig } from '../../../configs/app.config';
import { pathConfig } from '../../../configs/path.config';
import { Track } from '../../../entities/track.model';
import { DbService } from '../../shared/services/db.service';
import { Mp3Service } from '../../shared/services/mp3.service';
import { PlaylistService } from '../../shared/services/playlist.service';

@Injectable()
export class WebSocketService {
  public playDj = new Subject<any>();
  public playRadio = new Subject<void>();
  private redisClient;
  private redisSub;

  constructor(private mp3: Mp3Service, private playlist: PlaylistService) {
    this.redisClient = redis.createClient({
      host: 'redis'
    });
    this.redisSub = redis.createClient({
      host: 'redis'
    });

    this.subscribeToRedisGetNext();
  }

  private async subscribeToRedisGetNext(): Promise<void> {

    const connection = await DbService.getConnectionPromise();
    const trackRepository = connection.getRepository(Track);
    const tracksInDb = await trackRepository.createQueryBuilder('track').getCount();
    let count = 0;

    this.redisSub.on('message', (channel, message) => {
      this.playlist.getNext().subscribe(async queuedTrack => {
        console.log(channel, message);
        if (queuedTrack) {
          count = 0;
          this.playDj.next(queuedTrack);
          this.redisClient.set('next_song', queuedTrack.track.id);
          this.playlist.updateQueuedTrackPlayedAt(queuedTrack).subscribe();
        } else if (tracksInDb >= appConfig.nextSongVoteQuantity) {
          const randTrack = await trackRepository.createQueryBuilder('track')
            .orderBy('RAND()')
            .getOne();
          if (randTrack) {
            if (!fs.existsSync(pathConfig.tracks + '/' + randTrack.id + '.mp3')) {
              await this.mp3.downloadAndNormalize(randTrack.id);
            }
            this.redisClient.set('next_song', randTrack.id);
            this.playDj.next(randTrack);
          }
        } else {
          count = count + 1;
          this.redisClient.set('next_song', '10-sec-of-silence');
          if (count > 1) {
            this.playRadio.next();
          }

        }
      });
    });

    this.redisSub.subscribe('getNext');
  }
}
