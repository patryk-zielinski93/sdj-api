import { Track } from '@sdj/backend/radio/core/domain';
import { QueuedTrack as IQueuedTrack } from '@sdj/shared/domain';

export interface QueuedTrack extends IQueuedTrack {
  track: Track;
}
