import { INestMicroservice } from '@nestjs/common';
import { CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule, QueueTrackCommand } from '@sdj/backend/core';
import { CommandHandlers, TrackRepository } from '@sdj/backend/db';
import { microservices } from '@sdj/backend/shared/config';
import { first, switchMap, tap } from 'rxjs/operators';
import { RedisGetNextHandler } from '../cqrs/events/handlers/redis-get-next.handler';
import { PlayDjEvent } from '../cqrs/events/play-dj.event';
import { PlayRadioEvent } from '../cqrs/events/play-radio.event';
import { RedisGetNextEvent } from '../cqrs/events/redis-get-next.event';
import { RedisSagas } from '../cqrs/events/sagas/redis.sagas';
import { RedisService } from '../services/redis.service';

describe('Get Next', () => {
  let app: INestMicroservice;
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let trackRepository: TrackRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CoreModule, TypeOrmModule.forRoot()],
      providers: [
        RedisSagas,
        RedisService,
        RedisGetNextHandler,
        ...CommandHandlers
      ]
    }).compile();

    app = module.createNestMicroservice(microservices.ices);
    await app.init();
    commandBus = module.get<CommandBus>(CommandBus);
    eventBus = module.get<EventBus>(EventBus);
    trackRepository = module.get<TrackRepository>(TrackRepository);
  });

  describe('Should emit play silence and play queued track on get next', () => {
    it('Should emit play silence and play queued track', done => {
      eventBus
        .pipe(
          ofType(PlayRadioEvent),
          first(),
          tap(async () => {
            const track = await trackRepository.findOne();
            commandBus
              .execute(new QueueTrackCommand(track.id, 'Test'))
              .then(() => eventBus.publish(new RedisGetNextEvent('Test')));
          }),
          switchMap(() =>
            eventBus.pipe(
              ofType(PlayDjEvent),
              first()
            )
          )
        )
        .subscribe(() => done());
      eventBus.publish(new RedisGetNextEvent('Test'));
      eventBus.publish(new RedisGetNextEvent('Test'));
    });
  });

  afterAll(async () => {
    // tslint:disable-next-line: no-console
    app.close().catch(console.error);
  });
});
