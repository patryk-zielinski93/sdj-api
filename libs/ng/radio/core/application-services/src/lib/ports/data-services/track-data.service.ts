import { Track } from '@sdj/ng/radio/core/domain';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

export abstract class TrackDataService {
  abstract getMostPlayedTracks(
    channelId: string
  ): Observable<ApolloQueryResult<{ mostPlayedTracks: Track[] }>>;
}
