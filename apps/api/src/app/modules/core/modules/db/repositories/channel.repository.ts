import { EntityRepository, Repository } from 'typeorm';

import { Channel } from '../entities/channel.entity';

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  async findOrCreate(channelId: string): Promise<Channel> {
    let channel = await this.findOne(channelId);
    if (!channel) {
      channel = new Channel();
      channel.id = channelId;
      this.save(channel);
    }
    return channel;
  }
}
