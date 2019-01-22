import { EntityRepository, Repository } from 'typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { Track } from '../entities/track.model';

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {

    countTracks(): Promise<number> {
        return this.createQueryBuilder('track').getCount();
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
