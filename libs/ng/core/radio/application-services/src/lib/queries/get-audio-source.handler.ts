import { Injectable } from '@angular/core';
import { Channel } from '@sdj/ng/core/channel/api';
import { ExternalRadioEntity } from '@sdj/ng/core/radio/domain';
import { environment } from '@sdj/ng/core/shared/domain';
import { merge, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { GetAudioSourceQuery } from './get-audio-source.query';

@Injectable({ providedIn: 'root' })
export class GetAudioSourceHandler {
  private static getStreamFromExternalRadioOrChannel(
    channel: Channel,
    externalRadio?: ExternalRadioEntity
  ): string {
    return externalRadio ? externalRadio.url : channel.defaultStreamUrl;
  }

  exec(query: GetAudioSourceQuery): Observable<string> {
    const selectedChannelId = query.channel.id;
    return merge(
      of(
        GetAudioSourceHandler.getStreamFromExternalRadioOrChannel(
          query.channel,
          query.externalRadio
        )
      ),
      query.roomIsRunning$.pipe(
        filter(Boolean),
        first(),
        switchMap(() =>
          merge(
            of(environment.radioStreamUrl + selectedChannelId),
            query.playDj$.pipe(
              map(() => environment.radioStreamUrl + selectedChannelId)
            ),
            query.playRadio$.pipe(
              map(() =>
                GetAudioSourceHandler.getStreamFromExternalRadioOrChannel(
                  query.channel,
                  query.externalRadio
                )
              )
            )
          )
        )
      )
    ).pipe(map(streamUrl => streamUrl || environment.externalStream));
  }
}
