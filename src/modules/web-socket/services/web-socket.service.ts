import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as redis from 'redis';
import { Subject } from 'rxjs';
import { appConfig } from '../../../configs/app.config';
import { pathConfig } from '../../../configs/path.config';
import { TrackRepository } from '../../shared/modules/db/repositories/track.repository';
import { Mp3Service } from '../../shared/services/mp3.service';
import { PlaylistService } from '../../shared/services/playlist.service';

@Injectable()
export class WebSocketService {
  public playDj = new Subject<any>();
  public playRadio = new Subject<void>();
  private redisClient;
  private redisSub;

  constructor(
    private mp3: Mp3Service,
    private playlist: PlaylistService,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository
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

    const tracksInDb = await this.trackRepository.countTracks();
    let count = 0;

    this.redisSub.on('message', (channel, message) => {
      this.playlist.getNext().subscribe(async queuedTrack => {
        console.log(channel, message);
        if (queuedTrack) {
          count = 0;
          this.playDj.next(queuedTrack);
          this.redisClient.set('next_song', queuedTrack.track.id);
          this.playlist.updateQueuedTrackPlayedAt(queuedTrack);
        } else if (tracksInDb >= appConfig.nextSongVoteQuantity) {
          // ToDo move to repo
          const randTrack = await this.trackRepository.getRandomTrack();
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
