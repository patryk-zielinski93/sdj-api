import { INestApplication } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, ofType } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule, TrackRepository } from '@sdj/backend/db';
import { first, switchMap, tap } from 'rxjs/operators';
import { CommandHandlers, EventHandlers, Mp3Service, PlaylistService, PlaylistStore, RedisService } from '../..';
import { PlayDjEvent, PlayRadioEvent, QueueTrackCommand, RedisGetNextEvent } from '../cqrs';
import { RedisSagas } from '../cqrs/events/sagas/redis.sagas';

describe('Get Next', () => {
  let app: INestApplication;
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let trackRepository: TrackRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DbModule, CqrsModule, TypeOrmModule.forRoot()],
      providers: [
        ...CommandHandlers,
        ...EventHandlers,
        Mp3Service,
        PlaylistService,
        PlaylistStore,
        RedisSagas,
        RedisService
      ]
    }).compile();

    app = module.createNestApplication();
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
    app.close().catch(console.log);
  });
});
