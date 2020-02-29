import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '@sdj/backend/radio/core/domain';
import { ChannelDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelRepositoryAdapter extends ChannelDomainRepository {
  constructor(
    @InjectRepository(Channel)
    private typeOrmRepository: Repository<Channel>
  ) {
    super();
  }

  async findOrCreate(channelId: string): Promise<Channel> {
    let channel = await this.typeOrmRepository.findOne(channelId);
    if (!channel) {
      channel = new Channel();
      channel.id = channelId;
      this.save(channel);
    }
    return channel;
  }

  private save(channel: Channel): Promise<Channel> {
    return this.typeOrmRepository.save(channel);
  }
}
