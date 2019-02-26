import { EntityRepository, Repository } from 'typeorm';
import { RedisService } from '../../../services/redis.service';
import { QueuedTrack } from '../entities/queued-track.model';
import { Track } from '../entities/track.model';
import { User } from '../entities/user.model';

@EntityRepository(QueuedTrack)
export class QueuedTrackRepository extends Repository<QueuedTrack> {
    redisService: RedisService;

    countTracksInQueueFromUser(userId: string): Promise<number> {
        return this.createQueryBuilder('queuedTrack')
            .where('queuedTrack.playedAt IS NULL')
            .andWhere('queuedTrack.addedById = :userId')
            .setParameters({ userId })
            .getCount();
    }

    findQueuedTracks(): Promise<QueuedTrack[]> {
        return this.createQueryBuilder('queuedTrack')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .leftJoinAndSelect('queuedTrack.addedBy', 'user')
            .andWhere('queuedTrack.playedAt IS NULL')
            .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
            .getMany();
    }

    async getCurrentTrack(): Promise<QueuedTrack | undefined> {
        const currentTrackId = await this.redisService.getCurrentTrackId();
        if (currentTrackId === '10-sec-of-silence') {
            return;
        }
        return this.getCurrentTrackById(currentTrackId);
    }

    getCurrentTrackById(currentTrackId: string): Promise<QueuedTrack | undefined> {
        return <Promise<QueuedTrack>>this.createQueryBuilder('queuedTrack')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .leftJoinAndSelect('queuedTrack.addedBy', 'user')
            .where('queuedTrack.trackId = :trackId')
            .andWhere('queuedTrack.playedAt IS NOT NULL')
            .orderBy('queuedTrack.playedAt', 'DESC')
            .setParameter('trackId', currentTrackId)
            .getOne();
    }

    getNextSongInQueue(): Promise<QueuedTrack | undefined> {
        return this.createQueryBuilder('queuedTrack')
        // .addSelect('max(queuedTrack.id)')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .andWhere('queuedTrack.playedAt IS NULL')
            .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
            .getOne();
    }

    queueTrack(track: Track, randomized = false, user?: User): Promise<QueuedTrack> {
        const queuedTrack = new QueuedTrack();
        queuedTrack.createdAt = new Date();
        queuedTrack.addedBy = user || null;
        queuedTrack.order = 0;
        queuedTrack.track = track;
        queuedTrack.randomized = randomized;

        return this.save(queuedTrack);
    }
}
