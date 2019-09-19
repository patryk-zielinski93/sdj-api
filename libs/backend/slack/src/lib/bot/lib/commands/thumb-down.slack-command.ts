import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '@sdj/backend/config';
import { CqrsServiceFacade, HostService, StorageServiceFacade, ThumbDownCommand } from '@sdj/backend/core';
import { TrackRepository, VoteRepository } from '@sdj/backend/db';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class ThumbDownSlackCommand implements SlackCommand {
  description: string = 'Vote to skip that song';
  type: string = ':-1:';

  constructor(
    private slackService: SlackService,
    private readonly cqrsServiceFacade: CqrsServiceFacade,
    private readonly storageService: StorageServiceFacade,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(VoteRepository) private voteRepository: VoteRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const channelId = message.channel;
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      channelId
    );
    const unlikesCount = await this.voteRepository.countUnlinksForQueuedTrack(
      currentTrackInQueue.id,
      channelId
    );

    await this.cqrsServiceFacade.thumbDown(
      new ThumbDownCommand(currentTrackInQueue.id, message.user)
    );

    if (unlikesCount + 1 >= appConfig.nextSongVoteQuantity) {
      this.slackService.rtm.sendMessage(
        'Skipping ' +
          currentTrackInQueue.track.title +
          '\n' +
          (currentTrackInQueue.track.skips + 1) +
          ' times skipped',
        channelId
      );
      //ToDo Move to some event
      HostService.nextSong(channelId);

      currentTrackInQueue.track.skips++;
      this.trackRepository.save(currentTrackInQueue.track);
    } else {
      this.slackService.rtm.sendMessage(
        'Left ' +
          (appConfig.nextSongVoteQuantity - (unlikesCount + 1)) +
          ' before skip',
        channelId
      );
    }
  }
}
