import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Track } from '@sdj/backend/radio/core/domain';
import { connectionConfig } from '@sdj/backend/shared/config';
import { LoggerService } from '@sdj/backend/shared/logger';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { RedisGetNextEvent } from '../cqrs/events/regis-get-next/redis-get-next.event';

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
    const observable = new Observable<RedisData<T>>(
      (observer1: Observer<RedisData<T>>) => {
        this.redisSub.on(event, (channel, message) => {
          observer1.next({ channel, message });
        });
      }
    );

    const observer: Observer<RedisData<T>> = {
      // ToDo this always will be string
      next: (data: any) => {
        this.redisClient.publish(event, data);
      },
      error: () => {},
      complete: () => {}
    };

    return new AnonymousSubject<RedisData<T>>(observer, observable);
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
