import { EntityRepository, Repository } from 'typeorm';
import { Vote } from '../entities/vote.model';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {

  countUnlikesFromUserToQueuedTrack(queuedTrackId: number, userId: string): Promise<number> {
    return this.createQueryBuilder('vote')
      .where('vote.addedBy.id = :userId')
      .andWhere('vote.value = -1')
      .setParameter('userId', userId)
      .andWhere('vote.track.id = :trackId')
      .setParameter('trackId', queuedTrackId)
      .getCount();
  }

  countUnlinksForQueuedTrack(queuedTrackId): Promise<number> {
    return this.createQueryBuilder('unlike')
      .andWhere('unlike.track.id = :trackId')
      .setParameter('trackId', queuedTrackId.id)
      .getCount();
  }
}
