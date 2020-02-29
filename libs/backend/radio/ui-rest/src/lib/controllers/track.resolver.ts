import { Args, Query, Resolver } from '@nestjs/graphql';
import { Track } from '@sdj/backend/radio/core/domain';
import { TrackDomainRepository } from '@sdj/backend/radio/core/domain-service';

@Resolver(Track)
export class TrackResolver {
  constructor(private readonly trackRepository: TrackDomainRepository) {}

  @Query(returns => [Track])
  async mostPlayedTracks(
    @Args('channelId') channelId: string
  ): Promise<Track[]> {
    return this.trackRepository.findMostPlayedTracks(channelId);
  }
}
