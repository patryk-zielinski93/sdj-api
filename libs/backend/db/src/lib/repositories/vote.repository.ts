import { appConfig } from '@sdj/backend/shared/config';
import { EntityRepository, Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';

require('datejs');
const DateJS = <any>Date;

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  countTodayHeartsFromUser(userId: string, channelId: string): Promise<number> {
    return this.createQueryBuilder('vote')
      .where('vote.addedBy.id = :userId')
      .andWhere('vote.addedIn = :channelId')
      .andWhere('vote.value = 3')
      .andWhere('vote.createdAt > :today')
      .setParameter('channelId', channelId)
      .setParameter('today', DateJS.today().toString(appConfig.dbDateFormat))
      .setParameter('userId', userId)
      .getCount();
  }

  countTodayFucksFromUser(userId: string, channelId: string): Promise<number> {
    return this.createQueryBuilder('vote')
      .where('vote.addedBy.id = :userId')
      .andWhere('vote.addedIn = :channelId')
      .andWhere('vote.value = :value')
      .andWhere('vote.createdAt > :today')
      .setParameter('channelId', channelId)
      .setParameter('today', DateJS.today().toString(appConfig.dbDateFormat))
      .setParameter('userId', userId)
      .setParameter('value', -3)
      .getCount();
  }

  countPositiveVotesFromUserToQueuedTrack(
    queuedTrackId: number,
    userId: string
  ): Promise<number> {
    return this.createQueryBuilder('vote')
      .where('vote.addedBy.id = :userId')
      .andWhere('vote.value > 0')
      .setParameter('userId', userId)
      .andWhere('vote.track.id = :trackId')
      .setParameter('trackId', queuedTrackId)
      .getCount();
  }

  countUnlikesFromUserToQueuedTrack(
    queuedTrackId: number,
    userId: string,
    channelId: string
  ): Promise<number> {
    return this.createQueryBuilder('vote')
      .where('vote.addedBy.id = :userId')
      .andWhere('vote.addedIn = :channelId')
      .andWhere('vote.value < 0')
      .setParameter('userId', userId)
      .andWhere('vote.track.id = :trackId')
      .setParameter('channelId', channelId)
      .setParameter('trackId', queuedTrackId)
      .getCount();
  }

  countUnlinksForQueuedTrack(
    queuedTrackId: number,
    channelId: string
  ): Promise<number> {
    return this.createQueryBuilder('unlike')
      .where('unlike.value < 0')
      .andWhere('unlike.addedIn = :channelId')
      .andWhere('unlike.track.id = :trackId')
      .setParameter('channelId', channelId)
      .setParameter('trackId', queuedTrackId)
      .getCount();
  }
}
