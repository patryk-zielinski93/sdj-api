import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '@sdj/backend/config';
import { HostService, StorageServiceFacade } from '@sdj/backend/core';
import { TrackRepository, User, UserRepository, Vote, VoteRepository } from '@sdj/backend/db';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class ThumbDownSlackCommand implements SlackCommand {
  description: string = 'Vote to skip that song';
  type: string = ':-1:';

  constructor(
    private slackService: SlackService,
    private readonly storageService: StorageServiceFacade,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(VoteRepository) private voteRepository: VoteRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const userId = message.user;
    const user = await this.userRepository.findOne(userId);
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (!currentTrackInQueue) {
      return;
    }

    const unlikesCountFromUser = await this.voteRepository.countUnlikesFromUserToQueuedTrack(
      currentTrackInQueue.id,
      userId,
      message.channel
    );

    if (unlikesCountFromUser > 0) {
      return;
    }

    const unlikesCount = await this.voteRepository.countUnlinksForQueuedTrack(
      currentTrackInQueue.id,
      message.channel
    );

    if (unlikesCount + 1 >= appConfig.nextSongVoteQuantity) {
      this.slackService.rtm.sendMessage(
        'Skipping ' +
          currentTrackInQueue.track.title +
          '\n' +
          (currentTrackInQueue.track.skips + 1) +
          ' times skipped',
        message.channel
      );
      //ToDo Move to some event
      HostService.nextSong(message.channel);

      currentTrackInQueue.track.skips++;
      this.trackRepository.save(currentTrackInQueue.track);
    } else {
      this.slackService.rtm.sendMessage(
        'Left ' +
          (appConfig.nextSongVoteQuantity - (unlikesCount + 1)) +
          ' before skip',
        message.channel
      );
    }

    // ToDo move to command
    const unlike = new Vote(<User>user, currentTrackInQueue, -1);
    unlike.createdAt = new Date();
    this.voteRepository.save(unlike);
  }
}
