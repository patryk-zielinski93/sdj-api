import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { QueuedTrack } from '../modules/db/entities/queued-track.entity';

interface PlaylistState {
    silenceCount: number,
    queue: QueuedTrack[];
}

@Injectable()
export class PlaylistStore {
    get state(): PlaylistState {
        return this._state.getValue();
    }

    initialState: PlaylistState = {
        silenceCount: 0,
        queue: []
    };

    private _state: BehaviorSubject<PlaylistState> = new BehaviorSubject(this.initialState);

    addToQueue(queuedTrack: QueuedTrack): void {
        this._state.next({ ...this.state, queue: this.state.queue.concat(queuedTrack) });
    }

    setSilenceCount(value: number): void {
        this._state.next({ ...this.state, silenceCount: value });
    }

    getSilenceCount(): Observable<number> {
        return this._state.pipe(map((state: PlaylistState) => state.silenceCount));
    }

    getQueue(): Observable<QueuedTrack[]> {
        return this._state.pipe(map((state: PlaylistState) => state.queue), distinctUntilChanged());
    }

    removeFromQueue(queuedTrack: QueuedTrack): void {
        this._state.next({ ...this.state, queue: this.state.queue.filter((qTrack) => qTrack.id !== queuedTrack.id) });
    }
}
