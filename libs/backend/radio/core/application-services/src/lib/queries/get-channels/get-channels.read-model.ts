import { Channel } from '@sdj/backend/radio/core/domain';

export interface GetChannelsReadModel {
  [id: string]: Channel;
}
