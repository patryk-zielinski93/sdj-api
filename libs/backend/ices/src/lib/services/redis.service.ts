import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { LoggerService } from '@sdj/backend/common';
import { connectionConfig } from '@sdj/backend/config';
import { Track } from '@sdj/backend/db';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { Observable, Observer, Subject } from 'rxjs';
import { RedisGetNextEvent } from '../cqrs/events/redis-get-next.event';

interface RedisData<T> {
  channel: string;
  message: T;
}
type RedisSubject<T> = Subject<RedisData<T>>;

@Injectable()
export class RedisService {
  private redisClient: RedisClient;
  private redisSub: RedisClient;

  constructor(
    private readonly logger: LoggerService,
    private readonly publisher: EventBus
  ) {
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

  sendNextSong(channelId: string, track: Track): void {
    this.getNextSongSubject(channelId).next(<any>track.id);
  }

  getMessageSubject(): RedisSubject<string> {
    return this.createSubject('message');
  }

  private async handleGetNext(): Promise<void> {
    const redisMessage = this.getMessageSubject();

    redisMessage.subscribe(({ channel, message }) => {
      this.logger.log(channel, message);
      this.publisher.publish(new RedisGetNextEvent(message));
    });
  }
}
