import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { Observable, of, Subject } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { pathConfig } from '../../../configs/path.config';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../modules/db/repositories/track.repository';
import { UserRepository } from '../modules/db/repositories/user.repository';
import { Mp3Service } from './mp3.service';
import { PlaylistService } from './playlist.service';
import { WebSocketService } from './web-socket.service';

type RedisSubject = Subject<{ channel: string, message: any } | any>;

export class RedisService {
    private handlingNextSong = false;
    private nextSongSubject: RedisSubject;
    private redisClient: RedisClient;
    private redisSub: RedisClient;

    constructor(private mp3: Mp3Service,
                private playlist: PlaylistService,
                private wsService: WebSocketService,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
                @InjectRepository(QueuedTrackRepository) private queueTrackRepository: QueuedTrackRepository,
                @InjectRepository(UserRepository) private userRepository: UserRepository) {
        this.redisClient = redis.createClient({
            host: 'redis'
        });
        this.redisSub = redis.createClient({
            host: 'redis'
        });
        this.handleGetNext();
        this.nextSongSubject = this.getNextSongSubject();
        this.redisSub.subscribe('getNext');
    }

    createSubject(event: string): RedisSubject {
        let observable = new Observable(observer => {
            this.redisSub.on(event, (channel, message) => {
                observer.next({ channel, message });
            });
        });

        let observer = {
            next: (data: string) => {
                this.redisClient.set(event, data);
            }
        };

        return Subject.create(observer, observable);
    }

    getNextSongSubject(): RedisSubject {
        return this.createSubject('next_song');
    }

    getMessageSubject(): RedisSubject {
        return this.createSubject('message');
    }

    private async handleGetNext(): Promise<void> {

        let count = 0;

        const redisMessage = this.getMessageSubject();

        redisMessage.subscribe(({ channel, message }) => {
            if (this.handlingNextSong) return;
            this.handlingNextSong = true;
            this.playlist.getNext()
                .then(async (queuedTrack: QueuedTrack | undefined) => {
                    console.log(channel, message);
                    if (queuedTrack) {
                        count = 0;
                        this.downloadAndPlay(queuedTrack)
                            .pipe(finalize(() => {
                                this.handlingNextSong = false;
                            }))
                            .subscribe(undefined, () => {
                                const track = queuedTrack.track;
                                console.log('Can\'t download track ' + track.id);
                                console.log('Removing ' + track.title);
                                // TODO CASCADE DELETE
                                // track.queuedTracks.forEach((qTrack: QueuedTrack) => {
                                //     this.queueTrackRepository.remove(qTrack);
                                // });
                                // this.trackRepository.remove(track);
                                this.playlist.updateQueuedTrackPlayedAt(queuedTrack);
                            });
                    } else {
                        count = count + 1;
                        this.nextSongSubject.next('10-sec-of-silence');
                        if (count > 1) {
                            this.wsService.playRadio.next();
                        }
                        this.handlingNextSong = false;
                    }
                });
        });

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
        this.nextSongSubject.next(queuedTrack.track.id);
        this.wsService.playDj.next(queuedTrack);
        this.playlist.updateQueuedTrackPlayedAt(queuedTrack);
        return of(null);
    }
}