import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, filter, first } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrack, QueuedTrackRepository } from '@sdj/backend/db';

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

  private _state: BehaviorSubject<PlaylistState> = new BehaviorSubject(
    initialPlaylistState
  );

  constructor(
    @InjectRepository(QueuedTrackRepository)
    private readonly queuedTrackRepository: QueuedTrackRepository
  ) {}

  channelAppear(channelId: string): Observable<void> {
    return this._state.pipe(
      filter(state => !!state[channelId]),
      map(channelState => undefined),
      first()
    );
  }

  channelDisappears(channelId: string): void {
    const state = this.state;
    delete state[channelId];
    this._state.next(state);
  }

  async getChannelState(channelId: string): Promise<ChannelState> {
    if (!this.state[channelId]) {
      this.state[channelId] = {
        ...initialChannelState,
        queue: await this.queuedTrackRepository.findQueuedTracks(channelId)
      };
    }
    return this.state[channelId];
  }

  async getCurrentTrack(channelId: string): Promise<QueuedTrack | null> {
    return (await this.getChannelState(channelId)).currentTrack;
  }

  async setCurrentTrack(channelId: string, queuedTrack: QueuedTrack | null): Promise<void> {
    const channelState = await this.getChannelState(channelId);
    this._state.next({
      ...this.state,
      [channelId]: { ...channelState, currentTrack: queuedTrack }
    });
  }

  async addToQueue(queuedTrack: QueuedTrack): Promise<void> {
    const channelState = await this.getChannelState(queuedTrack.playedIn.id);
    this._state.next({
      ...this.state,
      [queuedTrack.playedIn.id]: {
        ...channelState,
        queue: channelState.queue.concat(queuedTrack)
      }
    });
  }

  async setSilenceCount(channelId: string, value: number): Promise<void> {
    const channelState = await this.getChannelState(channelId);
    this._state.next({
      ...this.state,
      [channelId]: { ...channelState, silenceCount: value }
    });
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

  async removeFromQueue(queuedTrack: QueuedTrack): Promise<void> {
    const channelState = await this.getChannelState(queuedTrack.playedIn.id);
    this._state.next({
      ...this.state,
      [queuedTrack.playedIn.id]: {
        ...channelState,
        queue: channelState.queue.filter(qTrack => qTrack.id !== queuedTrack.id)
      }
    });
  }
}
