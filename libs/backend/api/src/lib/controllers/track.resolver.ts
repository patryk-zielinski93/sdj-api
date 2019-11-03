import { Args, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Track, TrackRepository } from "@sdj/backend/db";

@Resolver(Track)
export class TrackResolver {
  constructor(
    @InjectRepository(TrackRepository)
    private readonly trackRepository: TrackRepository
  ) {}

  @Query(returns => [Track])
  async mostPlayedTracks(
    @Args('channelId') channelId: string
  ): Promise<Track[]> {
    return this.trackRepository.findMostPlayedTracks(channelId);
  }
}
