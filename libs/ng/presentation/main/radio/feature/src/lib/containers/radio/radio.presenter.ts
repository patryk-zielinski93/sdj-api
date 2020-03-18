import { Injectable } from '@angular/core';
import { Channel } from '@sdj/ng/core/channel/domain';
import { RadioFacade } from '@sdj/ng/core/radio/application-services';
import { environment } from '@sdj/ng/core/shared/domain';
import { merge, Observable, of, Subject } from 'rxjs';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class RadioPresenter {
  constructor(private radioFacade: RadioFacade) {}

  getAudioSrc(
    selectedChannel: Channel,
    selectedChannelUnsubscribe: Observable<void>
  ): Observable<string> {
    const selectedChannelId = selectedChannel.id;
    return merge(
      of(selectedChannel.defaultStreamUrl),
      this.radioFacade.roomIsRunning$.pipe(
        first(),
        switchMap(() =>
          merge(
            of(environment.radioStreamUrl + selectedChannelId),
            this.radioFacade.playDj$.pipe(
              takeUntil(selectedChannelUnsubscribe),
              map(() => environment.radioStreamUrl + selectedChannelId)
            ),
            this.radioFacade.playRadio$.pipe(
              takeUntil(selectedChannelUnsubscribe),
              map(() => selectedChannel.defaultStreamUrl)
            )
          )
        )
      )
    ).pipe(map(streamUrl => streamUrl || environment.externalStream));
  }

  recreateSubject(subject: Subject<void>): Subject<void> {
    subject.next();
    subject.complete();
    return new Subject();
  }
}
