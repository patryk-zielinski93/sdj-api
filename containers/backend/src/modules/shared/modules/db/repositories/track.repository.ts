import { EntityRepository, Repository } from 'typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { Track } from '../entities/track.model';

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {

    countTracks(): Promise<number> {
        return this.createQueryBuilder('track').getCount();
    }

    findTopRatedTracks(index?: number, limit?: number): Promise<Track[]> {
        const qb = this.createQueryBuilder('track')
            .innerJoin('track.queuedTracks', 'queuedTrack')
            .leftJoin('queuedTrack.votes', 'vote')
            .where('vote.value > 0')
            .groupBy('track.id')
            .orderBy('COUNT(track.id)', 'DESC');
        if (index) {
            qb.offset(index);
            qb.limit(limit || 1);
        }
        return qb
            .getMany();
    }

    findMostPlayedTracks(index?: number, limit?: number): Promise<Track[]> {
        const qb = this.createQueryBuilder('track')
            .innerJoin('track.queuedTracks', 'queuedTrack')
            .where('queuedTrack.randomized = 0')
            .groupBy('track.id')
            .orderBy('COUNT(track.id)', 'DESC');
        if (index) {
            qb.offset(index);
            qb.limit(limit || 1);
        }
        return qb
            .getMany();
    }

    async getRandomTrack(): Promise<Track> {
        const rawOne = await this.createQueryBuilder('track')
            .select('DISTINCT track.id, vote.id as vId, vote.value')
            .orderBy('RAND()')
            .innerJoin('track.queuedTracks', 'queuedTrack')
            .leftJoin('queuedTrack.votes', 'vote')
            .where('skips < ' + appConfig.skipsToBan)
            .andWhere('vote.value > 0')
            .orWhere('vote.value IS NULL')
            .getRawOne();

        return this.findOneOrFail(rawOne.id);
    }
}
