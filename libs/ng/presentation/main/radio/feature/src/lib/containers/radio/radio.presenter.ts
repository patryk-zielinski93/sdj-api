import { Injectable } from '@angular/core';
import { ChannelFacade } from '@sdj/ng/core/radio/application-services';
import { dynamicEnv } from '@sdj/ng/core/radio/domain';
import { merge, Observable, Subject } from 'rxjs';
import { first, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class RadioPresenter {
  constructor(private channelFacade: ChannelFacade) {}

  getAudioSrc(
    selectedChannelId: string,
    selectedChannelUnsubscribe: Observable<void>
  ): Observable<string> {
    return this.channelFacade.roomIsRunning$.pipe(
      first(),
      switchMap(() =>
        merge(
          this.channelFacade.playDj$.pipe(
            takeUntil(selectedChannelUnsubscribe),
            map(() => dynamicEnv.radioStreamUrl + selectedChannelId)
          ),
          this.channelFacade.playRadio$.pipe(
            takeUntil(selectedChannelUnsubscribe),
            map(() => dynamicEnv.externalStream)
          )
        )
      ),
      startWith(dynamicEnv.radioStreamUrl + selectedChannelId)
    );
  }

  recreateSubject(subject: Subject<void>): Subject<void> {
    subject.next();
    subject.complete();
    return new Subject();
  }
}
