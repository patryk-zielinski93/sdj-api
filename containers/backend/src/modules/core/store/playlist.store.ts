import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';

interface PlaylistState {
    silenceCount: number,
    handlingNextSong: boolean;
    list: QueuedTrack[];
}

@Injectable()
export class PlaylistStore {
    get state(): BehaviorSubject<PlaylistState> {
        return this._state;
    }

    initialState: PlaylistState = {
        silenceCount: 0,
        handlingNextSong: false,
        list: []
    };

    private _state: BehaviorSubject<PlaylistState> = new BehaviorSubject(this.initialState);

    startHandlingNextSong(): void {
        this._state.next({...this._state.getValue(), handlingNextSong: true});
    }

    isNextSongaHandled(): Observable<boolean> {
        return this._state.pipe(map((state: PlaylistState) => state.handlingNextSong));
    }

    endHandlingNextSong(): void {
        this._state.next({...this._state.getValue(), handlingNextSong: false});
    }

    setSilenceCount(value: number): void {
        this._state.next({...this._state.getValue(), silenceCount: value});
    }

    getSilenceCount(): Observable<number> {
        return this._state.pipe(map((state: PlaylistState) => state.silenceCount));
    }
}
