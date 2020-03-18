import { inject, TestBed } from '@angular/core/testing';
import { RadioFacade } from '@sdj/ng/core/radio/application-services';
import { environment } from '@sdj/ng/core/shared/domain';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { createSpyObj } from 'jest-createspyobj';
import { cold, hot } from 'jest-marbles';
import { Subject } from 'rxjs';

import { RadioPresenter } from './radio.presenter';
import Mocked = jest.Mocked;

describe('RadioPresenterService', () => {
  let service: RadioPresenter;
  let radioFacade: Mocked<RadioFacade>;
  const channel = { id: '1234', defaultStreamUrl: 'url' } as any;
  const channelRadioStream = environment.radioStreamUrl + channel.id;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RadioPresenter,
        { provide: RadioFacade, useValue: createSpyObj(RadioFacade) },
        { provide: WebSocketClient, useValue: createSpyObj(WebSocketClient) }
      ]
    });
    service = TestBed.inject(RadioPresenter);
    radioFacade = TestBed.inject<any>(RadioFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAudioSrc', () => {
    test('emits channel default stream on the beginning', () => {
      radioFacade.roomIsRunning$ = cold('-');
      const result = service.getAudioSrc(channel, {} as any);
      expect(result).toBeObservable(hot('a', { a: channel.defaultStreamUrl }));
    });

    test('emits channel stream when room is running', () => {
      radioFacade.roomIsRunning$ = cold('-a');
      radioFacade.playDj$ = cold('');
      radioFacade.playRadio$ = cold('');
      const result = service.getAudioSrc(channel, new Subject());
      expect(result).toBeObservable(
        hot('ab', { a: channel.defaultStreamUrl, b: channelRadioStream })
      );
    });

    test('switch between channel stream and radio when room is running', () => {
      radioFacade.roomIsRunning$ = cold('-a');
      radioFacade.playDj$ = cold('-a-a-a');
      radioFacade.playRadio$ = cold('--a-a');
      const result = service.getAudioSrc(channel, new Subject());
      expect(result).toBeObservable(
        hot('abbabab', { a: channel.defaultStreamUrl, b: channelRadioStream })
      );
    });
  });
});
