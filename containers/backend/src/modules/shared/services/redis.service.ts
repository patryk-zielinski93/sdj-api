import { AggregateRoot, CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { Observable, Subject } from 'rxjs';
import { PlayRadioCommand } from '../../web-socket/cqrs/command-bus/commands/play-radio.command';
import { RedisGetNextEvent } from '../cqrs/events/redis-get-next.event';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../modules/db/repositories/track.repository';
import { UserRepository } from '../modules/db/repositories/user.repository';
import { PlaylistStore } from '../store/playlist.store';
import { PlaylistService } from './playlist.service';

type RedisSubject = Subject<{ channel: string, message: any } | any>;

export class RedisService extends AggregateRoot {
    private handlingNextSong = false;
    private nextSongSubject: RedisSubject;
    private redisClient: RedisClient;
    private redisSub: RedisClient;

    constructor(private readonly commandBus: CommandBus,
                private playlist: PlaylistService,
                private playlistStore: PlaylistStore,
                private readonly publisher: EventBus,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
                @InjectRepository(QueuedTrackRepository) private queueTrackRepository: QueuedTrackRepository,
                @InjectRepository(UserRepository) private userRepository: UserRepository) {
        super();
        this.redisClient = redis.createClient({
            host: 'redis'
        });
        this.redisSub = redis.createClient({
            host: 'redis'
        });
        this.playlistStore.isNextSongaHandled().subscribe((value) => {
            this.handlingNextSong = value;
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
            this.playlistStore.startHandlingNextSong();
            this.playlist.getNext()
                .then(async (queuedTrack: QueuedTrack | undefined) => {
                    console.log(channel, message);
                    if (queuedTrack) {
                        count = 0;
                        this.publisher.publish(new RedisGetNextEvent(queuedTrack));
                        this.playlistStore.endHandlingNextSong();
                    } else {
                        count = count + 1;
                        this.nextSongSubject.next('10-sec-of-silence');
                        if (count > 1) {
                            this.commandBus.execute(new PlayRadioCommand());
                            this.playlistStore.endHandlingNextSong();
                        }
                    }
                });
        });

    }
}