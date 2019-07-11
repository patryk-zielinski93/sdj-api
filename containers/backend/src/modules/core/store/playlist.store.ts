import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, filter } from 'rxjs/operators';
import { QueuedTrack } from '../modules/db/entities/queued-track.entity';
import { Channel } from '../modules/db/entities/channel.entity';

interface ChannelState {
  silenceCount: number;
  queue: QueuedTrack[];
  currentTrack: QueuedTrack | null;
}

interface PlaylistState {
  [key: string]: ChannelState;
}

const initialChannelState = { silenceCount: 0, queue: [], currentTrack: null };
const initialPlaylistState = {};

@Injectable()
export class PlaylistStore {
  get state(): PlaylistState {
    return this._state.getValue();
  }

  private _state: BehaviorSubject<PlaylistState> = new BehaviorSubject(initialPlaylistState);

  getChannelState(channelId: string): ChannelState {
    if (!this.state[channelId]) {
      this.state[channelId] = initialChannelState;
    }
    return this.state[channelId];
  }

  getCurrentTrack(channelId: string): QueuedTrack | null {
    return this.getChannelState(channelId).currentTrack;
  }

  setCurrentTrack(channelId: string, queuedTrack: QueuedTrack | null): void {
    const channelState = this.getChannelState(channelId);
    this._state.next({
      ...this.state,
      [channelId]: { ...channelState, currentTrack: queuedTrack }
    });
  }

  addToQueue(queuedTrack: QueuedTrack): void {
    const channelState = this.getChannelState(queuedTrack.playedIn.id);
    this._state.next({
      ...this.state,
      [queuedTrack.playedIn.id]: {
        ...channelState,
        queue: channelState.queue.concat(queuedTrack)
      }
    });
  }

  setSilenceCount(channelId: string, value: number): void {
    const channelState = this.getChannelState(channelId);
    this._state.next({ ...this.state, [channelId]: { ...channelState, silenceCount: value } });
  }

  getSilenceCount(channelId: string): Observable<number> {
    return this._state.pipe(
      filter((state: PlaylistState) => !!state[channelId]),
      map((state: PlaylistState) => state[channelId]),
      map((state: ChannelState) => state.silenceCount)
    );
  }

  getQueue(channelId: string): Observable<QueuedTrack[]> {
    return this._state.pipe(
      filter((state: PlaylistState) => !!state[channelId]),
      map((state: PlaylistState) => state[channelId]),
      map((state: ChannelState) => state.queue),
      distinctUntilChanged()
    );
  }

  removeFromQueue(queuedTrack: QueuedTrack): void {
    const channelState = this.getChannelState(queuedTrack.playedIn.id);
    this._state.next({
      ...this.state,
      [queuedTrack.playedIn.id]: {
        ...channelState,
        queue: channelState.queue.filter(qTrack => qTrack.id !== queuedTrack.id)
      }
    });
  }
}
