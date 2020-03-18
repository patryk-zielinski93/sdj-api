import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Channel } from '@sdj/backend/radio/core/domain';
import { ChannelDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { ArrayUtil } from '@sdj/shared/utils';
import { GetChannelsQuery } from './get-channels.query';
import { GetChannelsReadModel } from './get-channels.read-model';

@QueryHandler(GetChannelsQuery)
export class GetChannelsHandler implements IQueryHandler<GetChannelsQuery> {
  constructor(private channelRepository: ChannelDomainRepository) {}

  async execute(query: GetChannelsQuery): Promise<GetChannelsReadModel> {
    let channels: Channel[];
    if (query.channelIds) {
      channels = await this.channelRepository.findByIds(query.channelIds);
    } else {
      channels = await this.channelRepository.findAll();
    }
    return ArrayUtil.arrayToMap(channels);
  }
}
