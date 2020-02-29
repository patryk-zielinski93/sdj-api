import { Vote } from '@sdj/backend/radio/core/domain';

export abstract class VoteDomainRepository {
  abstract countTodayHeartsFromUser(
    userId: string,
    channelId: string
  ): Promise<number>;

  abstract countTodayFucksFromUser(
    userId: string,
    channelId: string
  ): Promise<number>;

  abstract countPositiveVotesFromUserToQueuedTrack(
    queuedTrackId: number,
    userId: string
  ): Promise<number>;
  abstract countUnlikesFromUserToQueuedTrack(
    queuedTrackId: number,
    userId: string,
    channelId: string
  ): Promise<number>;
  abstract countUnlinksForQueuedTrack(
    queuedTrackId: number,
    channelId: string
  ): Promise<number>;

  abstract async save(vote: Vote): Promise<Vote>;

  abstract async remove(vote: Vote): Promise<Vote>;
}
