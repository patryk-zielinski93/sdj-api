import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';

interface PlaylistState {
    silenceCount: number,
    handlingNextSong: boolean;
    queue: QueuedTrack[];
}

@Injectable()
export class PlaylistStore {
    get state(): PlaylistState {
        return this._state.getValue();
    }

    initialState: PlaylistState = {
        silenceCount: 0,
        handlingNextSong: false,
        queue: []
    };

    private _state: BehaviorSubject<PlaylistState> = new BehaviorSubject(this.initialState);

    addToQueue(queuedTrack: QueuedTrack): void {
        this._state.next({ ...this.state, queue: this.state.queue.concat(queuedTrack) });
    }

    startHandlingNextSong(): void {
        this._state.next({ ...this.state, handlingNextSong: true });
    }

    isNextSongHandled(): Observable<boolean> {
        return this._state.pipe(map((state: PlaylistState) => state.handlingNextSong));
    }

    endHandlingNextSong(): void {
        this._state.next({ ...this.state, handlingNextSong: false });
    }

    setSilenceCount(value: number): void {
        this._state.next({ ...this.state, silenceCount: value });
    }

    getSilenceCount(): Observable<number> {
        return this._state.pipe(map((state: PlaylistState) => state.silenceCount));
    }

    getQueue(): Observable<QueuedTrack[]> {
        return this._state.pipe(map((state: PlaylistState) => state.queue));
    }

    removeFromQueue(queuedTrack: QueuedTrack): void {
        this._state.next({ ...this.state, queue: this.state.queue.filter((qTrack) => qTrack.id !== queuedTrack.id) });
    }
}
