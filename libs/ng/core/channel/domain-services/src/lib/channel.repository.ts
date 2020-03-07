import { Channel } from '@sdj/ng/core/channel/domain';
import { Observable } from 'rxjs';

export abstract class ChannelRepository {
  abstract getChannels(): Observable<Channel[]>;
}
