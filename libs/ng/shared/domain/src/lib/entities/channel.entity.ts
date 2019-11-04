import { Channel as IChannel } from '@sdj/shared/domain';

export interface Channel extends IChannel {
  users: number;
}
