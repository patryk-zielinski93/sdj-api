import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';

interface PlaylistSate {
    handlingNextSong: boolean;
    list: QueuedTrack[];
}

@Injectable()
export class PlaylistStore {
    initialState: PlaylistSate = {
        handlingNextSong: false,
        list: []
    };

    state: BehaviorSubject<PlaylistSate> = new BehaviorSubject(this.initialState);

    startHandlingNextSong(): void {
        this.state.next({ ...this.state.getValue(), handlingNextSong: true });
    }

    isNextSongaHandled(): Observable<boolean> {
        return this.state.pipe(map((state: PlaylistSate) => state.handlingNextSong));
    }

    endHandlingNextSong(): void {
        this.state.next({ ...this.state.getValue(), handlingNextSong: false });
    }
}