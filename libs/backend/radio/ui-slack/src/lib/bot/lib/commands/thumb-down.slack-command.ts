import { Injectable } from '@nestjs/common';
import {
  RadioFacade,
  ThumbDownCommand
} from '@sdj/backend/radio/core/application-services';
import {
  TrackDomainRepository,
  VoteDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import { Store } from '@sdj/backend/radio/infrastructure';
import { appConfig } from '@sdj/backend/shared/config';
import { HostService } from '../../../../../../infrastructure/src/lib/host.service';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class ThumbDownSlackCommand implements SlackCommand {
  description: string = 'Vote to skip that song';
  type: string = ':-1:';

  constructor(
    private slackService: SlackService,
    private readonly radioFacade: RadioFacade,
    private readonly storageService: Store,
    private trackRepository: TrackDomainRepository,
    private voteRepository: VoteDomainRepository
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

    await this.radioFacade.thumbDown(
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
