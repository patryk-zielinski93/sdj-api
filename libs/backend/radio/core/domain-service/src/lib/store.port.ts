import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import { Observable } from 'rxjs';

interface ChannelState {
  silenceCount: number;
  queue: QueuedTrack[];
  currentTrack: QueuedTrack | null;
}

interface State {
  [key: string]: ChannelState;
}

export abstract class Store {
  abstract channelAppears(channelId: string): Promise<unknown>;
  abstract channelDisappears(channelId: string): void;

  abstract async getChannelState(channelId: string): Promise<ChannelState>;
  abstract async getCurrentTrack(
    channelId: string
  ): Promise<QueuedTrack | null>;

  abstract async setCurrentTrack(
    channelId: string,
    queuedTrack: QueuedTrack | null
  ): Promise<void>;

  abstract async addToQueue(queuedTrack: QueuedTrack): Promise<void>;

  abstract async setSilenceCount(
    channelId: string,
    value: number
  ): Promise<void>;

  abstract async getSilenceCount(channelId: string): Promise<number>;

  abstract getQueue(channelId: string): Observable<QueuedTrack[]>;

  abstract async removeFromQueue(queuedTrack: QueuedTrack): Promise<void>;
}
