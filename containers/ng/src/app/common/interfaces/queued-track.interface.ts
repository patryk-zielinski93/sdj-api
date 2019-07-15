import { Track } from './track.interface';

export interface QueuedTrack {
  id: number;
  addedBy: any;
  track: Track;
}
