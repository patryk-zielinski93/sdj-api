import { EntityRepository, Repository } from 'typeorm';
import { RedisService } from '../../../services/redis.service';
import { Channel } from '../entities/channel.entity';
import { QueuedTrack } from '../entities/queued-track.entity';
import { Track } from '../entities/track.entity';
import { User } from '../entities/user.entity';

@EntityRepository(QueuedTrack)
export class QueuedTrackRepository extends Repository<QueuedTrack> {
    redisService: RedisService;

    countTracksInQueueFromUser(userId: string, channelId: string): Promise<number> {
        return this.createQueryBuilder('queuedTrack')
            .where('queuedTrack.playedAt IS NULL')
            .andWhere('queuedTrack.addedById = :userId')
            .andWhere('queuedTrack.playedIn = :channelId')
            .setParameters({ userId })
            .setParameter('channelId', channelId)
            .getCount();
    }

    findQueuedTracks(channelId: string): Promise<QueuedTrack[]> {
        return this.createQueryBuilder('queuedTrack')
            .where('queuedTrack.playedIn = :channelId')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .leftJoinAndSelect('queuedTrack.addedBy', 'user')
            .andWhere('queuedTrack.playedAt IS NULL')
            .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
            .setParameter('channelId', channelId)
            .getMany();
    }

    async getCurrentTrack(channelId: string): Promise<QueuedTrack | undefined> {
        const currentTrackId = await this.redisService.getCurrentTrackId();
        if (currentTrackId === '10-sec-of-silence') {
            return;
        }
        return this.getCurrentTrackById(currentTrackId, channelId);
    }

    getCurrentTrackById(currentTrackId: string, channelId: string): Promise<QueuedTrack | undefined> {
        return <Promise<QueuedTrack>>this.createQueryBuilder('queuedTrack')
            .where('queuedTrack.playedIn = :channelId')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .leftJoinAndSelect('queuedTrack.addedBy', 'user')
            .where('queuedTrack.trackId = :trackId')
            .andWhere('queuedTrack.playedAt IS NOT NULL')
            .orderBy('queuedTrack.playedAt', 'DESC')
            .setParameter('channelId', channelId)
            .setParameter('trackId', currentTrackId)
            .getOne();
    }

    getNextSongInQueue(channelId: string): Promise<QueuedTrack | undefined> {
        return this.createQueryBuilder('queuedTrack')
        // .addSelect('max(queuedTrack.id)')
            .where('queuedTrack.playedIn = :channelId')
            .leftJoinAndSelect('queuedTrack.track', 'track')
            .andWhere('queuedTrack.playedAt IS NULL')
            .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
            .setParameter('channelId', channelId)
            .getOne();
    }

    queueTrack(track: Track, channel: Channel, randomized = false, user?: User): Promise<QueuedTrack> {
        const queuedTrack = new QueuedTrack();
        queuedTrack.createdAt = new Date();
        queuedTrack.addedBy = user || null;
        queuedTrack.playedIn = channel;
        queuedTrack.order = 0;
        queuedTrack.track = track;
        queuedTrack.randomized = randomized;

        return this.save(queuedTrack);
    }
}
