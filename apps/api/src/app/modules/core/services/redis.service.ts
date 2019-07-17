import { AggregateRoot, CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { Observable, Subject } from 'rxjs';
import { RedisGetNextEvent } from '../cqrs/events/redis-get-next.event';
import { QueuedTrackRepository } from '../modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../modules/db/repositories/track.repository';
import { UserRepository } from '../modules/db/repositories/user.repository';
import { PlaylistStore } from '../store/playlist.store';
import { connectionConfig } from '../../../configs/connection.config';

type RedisSubject = Subject<{ channel: string; message: any } | any>;

export class RedisService extends AggregateRoot {
  private redisClient: RedisClient;
  private redisSub: RedisClient;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly publisher: EventBus,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(QueuedTrackRepository) private queueTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super();
    this.redisClient = redis.createClient({
      host: connectionConfig.redis.host
    });
    this.redisSub = redis.createClient({
      host: connectionConfig.redis.host
    });
    this.handleGetNext();
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
        this.redisClient.publish(event, data);
      }
    };

    return Subject.create(observer, observable);
  }

  getNextSongSubject(channelId: string): RedisSubject {
    return this.createSubject(channelId);
  }

  getMessageSubject(): RedisSubject {
    return this.createSubject('message');
  }

  private async handleGetNext(): Promise<void> {
    const redisMessage = this.getMessageSubject();

    redisMessage.subscribe(({ channel, message }) => {
      console.log(channel, message);
      this.publisher.publish(new RedisGetNextEvent(message));
    });
  }
}
