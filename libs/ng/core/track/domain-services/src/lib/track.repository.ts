import { Track } from '@sdj/ng/core/track/domain';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

export abstract class TrackRepository {
  abstract loadMostPlayedTracks(
    channelId: string
  ): Observable<ApolloQueryResult<{ mostPlayedTracks: Track[] }>>;
}
