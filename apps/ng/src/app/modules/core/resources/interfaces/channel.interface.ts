import { Channel as IChannel } from '@sdj/shared/common';
export interface Channel extends IChannel {
  users: number;
}
