import { Injectable } from '@angular/core';
import { RadioFacade } from '@sdj/ng/core/radio/application-services';
import { environment } from '@sdj/ng/core/shared/kernel';
import { merge, Observable, Subject } from 'rxjs';
import { first, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class RadioPresenter {
  constructor(private radioFacade: RadioFacade) {}

  getAudioSrc(
    selectedChannelId: string,
    selectedChannelUnsubscribe: Observable<void>
  ): Observable<string> {
    return this.radioFacade.roomIsRunning$.pipe(
      first(),
      switchMap(() =>
        merge(
          this.radioFacade.playDj$.pipe(
            takeUntil(selectedChannelUnsubscribe),
            map(() => environment.radioStreamUrl + selectedChannelId)
          ),
          this.radioFacade.playRadio$.pipe(
            takeUntil(selectedChannelUnsubscribe),
            map(() => environment.externalStream)
          )
        )
      ),
      startWith(environment.radioStreamUrl + selectedChannelId)
    );
  }

  recreateSubject(subject: Subject<void>): Subject<void> {
    subject.next();
    subject.complete();
    return new Subject();
  }
}
