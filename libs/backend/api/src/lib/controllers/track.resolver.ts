import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Track, TrackRepository } from '@sdj/backend/db';

@Resolver(Track)
export class TrackResolver {
  constructor(@InjectRepository(TrackRepository) private readonly trackRepository: TrackRepository) {

  }

  @Query(returns => [Track])
  async mostPlayedTracks(@Args('channelId')channelId: string): Promise<Track[]> {
    console.log(channelId, await this.trackRepository.findMostPlayedTracks(channelId, 0, 10));
    return this.trackRepository.findWeeklyMostPlayedTracks(channelId);
  }
}
