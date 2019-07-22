import { AggregateRoot, CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { Observable, Subject, Observer } from 'rxjs';
import { RedisGetNextEvent } from '../cqrs/events/redis-get-next.event';
import {
  TrackRepository,
  QueuedTrackRepository,
  UserRepository
} from '@sdj/backend/db';
import { connectionConfig } from '@sdj/backend/config';

interface RedisData<T> {
  channel: string;
  message: T;
}
type RedisSubject<T> = Subject<RedisData<T>>;

export class RedisService extends AggregateRoot {
  private redisClient: RedisClient;
  private redisSub: RedisClient;

  constructor(private readonly publisher: EventBus) {
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

  createSubject<T>(event: string): RedisSubject<T> {
    // tslint:disable-next-line: no-shadowed-variable
    const observable = new Observable((observer: Observer<RedisData<T>>) => {
      this.redisSub.on(event, (channel, message) => {
        observer.next({ channel, message });
      });
    });

    const observer = {
      next: (data: string) => {
        this.redisClient.publish(event, data);
      }
    };

    return Subject.create(observer, observable);
  }

  getNextSongSubject(channelId: string): RedisSubject<string> {
    return this.createSubject(channelId);
  }

  getMessageSubject(): RedisSubject<string> {
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
