import { EntityRepository, Repository } from 'typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { Vote } from '../entities/vote.model';

require('datejs');

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {

    countTodayHeartsFromUser(userId: string): Promise<number> {
        return this.createQueryBuilder('vote')
            .where('vote.addedBy.id = :userId')
            .andWhere('vote.value = 3')
            .andWhere('vote.createdAt > :today')
            .setParameter('today', Date.today().toString(appConfig.dbDateFormat))
            .setParameter('userId', userId)
            .getCount();
    }

    countTodayFucksFromUser(userId: string): Promise<number> {
        return this.createQueryBuilder('vote')
            .where('vote.addedBy.id = :userId')
            .andWhere('vote.value = :value')
            .andWhere('vote.createdAt > :today')
            .setParameter('today', Date.today().toString(appConfig.dbDateFormat))
            .setParameter('userId', userId)
            .setParameter('value', -3)
            .getCount();
    }

    countPositiveVotesFromUserToQueuedTrack(queuedTrackId: number, userId: string): Promise<number> {
        return this.createQueryBuilder('vote')
            .where('vote.addedBy.id = :userId')
            .andWhere('vote.value > 0')
            .setParameter('userId', userId)
            .andWhere('vote.track.id = :trackId')
            .setParameter('trackId', queuedTrackId)
            .getCount();
    }

    countUnlikesFromUserToQueuedTrack(queuedTrackId: number, userId: string): Promise<number> {
        return this.createQueryBuilder('vote')
            .where('vote.addedBy.id = :userId')
            .andWhere('vote.value < 0')
            .setParameter('userId', userId)
            .andWhere('vote.track.id = :trackId')
            .setParameter('trackId', queuedTrackId)
            .getCount();
    }

    countUnlinksForQueuedTrack(queuedTrackId): Promise<number> {
        return this.createQueryBuilder('unlike')
            .where('unlike.value = -1')
            .andWhere('unlike.track.id = :trackId')
            .setParameter('trackId', queuedTrackId)
            .getCount();
    }
}
