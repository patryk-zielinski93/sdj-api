import { TestBed } from '@angular/core/testing';
import { environment } from '@sdj/ng/core/shared/domain';
import { cold, hot } from 'jest-marbles';
import { of } from 'rxjs';
import { GetAudioSourceHandler } from './get-audio-source.handler';
import { GetAudioSourceQuery } from './get-audio-source.query';

describe('TrackFacade', () => {
  let service: GetAudioSourceHandler;
  const channel = { id: '1234', defaultStreamUrl: 'url' } as any;
  const channelRadioStream = environment.radioStreamUrl + channel.id;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetAudioSourceHandler]
    });
    service = TestBed.inject(GetAudioSourceHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAudioSrc', () => {
    test('emits channel default stream on the beginning', () => {
      const roomIsRunning$ = cold('-');
      const query = new GetAudioSourceQuery(
        channel,
        roomIsRunning$,
        of(),
        of()
      );
      const result = service.exec(query);
      expect(result).toBeObservable(hot('a', { a: channel.defaultStreamUrl }));
    });

    test('emits channel stream when room is running', () => {
      const roomIsRunning$ = cold('-a');
      const playDj$ = cold('');
      const playRadio$ = cold('');
      const query = new GetAudioSourceQuery(
        channel,
        roomIsRunning$,
        playDj$,
        playRadio$
      );
      const result = service.exec(query);
      expect(result).toBeObservable(
        hot('ab', { a: channel.defaultStreamUrl, b: channelRadioStream })
      );
    });

    test('switch between channel stream and radio when room is running', () => {
      const roomIsRunning$ = cold('-a');
      const playDj$ = cold('-a-a-a');
      const playRadio$ = cold('--a-a');
      const query = new GetAudioSourceQuery(
        channel,
        roomIsRunning$,
        playDj$,
        playRadio$
      );
      const result = service.exec(query);
      expect(result).toBeObservable(
        hot('abbabab', { a: channel.defaultStreamUrl, b: channelRadioStream })
      );
    });
  });
});
