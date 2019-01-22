import { EntityRepository, Repository } from 'typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { Track } from '../entities/track.model';

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {

    countTracks(): Promise<number> {
        return this.createQueryBuilder('track').getCount();
    }

    getRandomTrack(): Promise<Track | undefined> {
        return this.createQueryBuilder('track')
            .orderBy('RAND()')
            .leftJoin('track.queuedTracks', 'queuedTrack')
            .leftJoin('queuedTrack.votes', 'vote')
            .where('skips < ' + appConfig.skipsToBan)
            .andWhere('vote.value > 0')
            .getOne();
    }
}
