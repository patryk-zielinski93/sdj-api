import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { QueuedTrack } from '../../../../shared/modules/db/entities/queued-track.model';
import { User } from '../../../../shared/modules/db/entities/user.model';
import { Vote } from '../../../../shared/modules/db/entities/vote.model';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { UserRepository } from '../../../../shared/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../shared/modules/db/repositories/vote.repository';
import { IcesService } from '../../../../shared/services/ices.service';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class VoteForNextSongCommand implements Command {
  description = 'Vote to skip that song';
  type = ':-1:';

  constructor(@InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
              @InjectRepository(UserRepository) private userRepository: UserRepository,
              @InjectRepository(VoteRepository) private voteRepository: VoteRepository) {
  }

  async handler(command: string[], message: any): Promise<any> {
    const userId = message.user;
    const user = await this.userRepository.findOne(userId);
    const currentTrackInQueue = <QueuedTrack>await this.queuedTrackRepository.getCurrentTrack();

    const unlikesCountFromUser = await this.voteRepository.countUnlikesFromUserToQueuedTrack(currentTrackInQueue.id, userId);

    if (unlikesCountFromUser > 0) {
      return;
    }

    const unlikesCount = await this.voteRepository.countUnlinksForQueuedTrack(currentTrackInQueue.id);

    if (unlikesCount + 1 >= appConfig.nextSongVoteQuantity) {
      IcesService.nextSong();
    }

    const unlike = new Vote(<User>user, currentTrackInQueue, -1);
    unlike.addedAt = new Date();
    this.voteRepository.save(unlike);
  };

}