import { Channel } from '@sdj/ng/core/channel/api';
import { ExternalRadioEntity } from '@sdj/ng/core/radio/domain';
import { Observable } from 'rxjs';

export class GetAudioSourceQuery {
  constructor(
    public channel: Channel,
    public roomIsRunning$: Observable<unknown>,
    public playDj$: Observable<unknown>,
    public playRadio$: Observable<unknown>,
    public externalRadio?: ExternalRadioEntity
  ) {}
}
