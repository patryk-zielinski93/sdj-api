import { User } from '@sdj/shared/domain';
import { Track } from './track.interface';

export interface QueuedTrack {
  id: number;
  addedBy: User;
  track: Track;
}
