import { Channel } from '@sdj/backend/radio/core/domain';

export abstract class ChannelDomainRepository {
  abstract async findOrCreate(channelId: string): Promise<Channel>;
}
