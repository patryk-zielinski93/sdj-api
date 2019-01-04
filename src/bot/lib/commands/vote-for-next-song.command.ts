import { appConfig } from '../../../configs/app.config';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { Unlike } from '../../../entities/unlike.model';
import { User } from '../../../entities/user.model';
import { DbService } from '../../../services/db.service';
import { IcesService } from '../../../services/ices.service';
import { Command } from '../interfaces/command.iterface';

export class VoteForNextSongCommand implements Command {
  description = 'Vote to skip that song';
  type = ':-1:';

  async handler(command: string[], message: any): Promise<any> {
    const userId = message.user;
    const connection = await DbService.getConnectionPromise();
    const user = await connection.getRepository(User).findOne(userId);
    const unlikeRepository = connection.getRepository(Unlike);
    const currentTrackInQueue = <QueuedTrack>await connection.getRepository(QueuedTrack)
      .createQueryBuilder('queuedTrack')
      .where('queuedTrack.playedAt IS NOT NULL')
      .limit(1)
      .orderBy('addedAt', 'DESC')
      .getOne();

    const unlikesCountFromUser = await unlikeRepository
      .createQueryBuilder('unlike')
      .where('unlike.addedBy.id = :userId')
      .setParameter('userId', userId)
      .andWhere('unlike.track.id = :trackId')
      .setParameter('trackId', currentTrackInQueue.id)
      .getCount();

    if (unlikesCountFromUser > 0) {
      return;
    }

    const unlikesCount = await unlikeRepository
      .createQueryBuilder('unlike')
      .andWhere('unlike.track.id = :trackId')
      .setParameter('trackId', currentTrackInQueue.id)
      .getCount();

    if (unlikesCount + 1 >= appConfig.nextSongVoteQuantity) {
      IcesService.nextSong();
    }

    const unlike = new Unlike(<User>user, currentTrackInQueue);
    unlike.addedAt = new Date();
    unlikeRepository.save(unlike);
  };

}