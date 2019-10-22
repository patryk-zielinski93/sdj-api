import { User } from '@sdj/shared/common';
import { Track } from './track.interface';

export interface QueuedTrack {
  id: number;
  addedBy: User;
  track: Track;
}
