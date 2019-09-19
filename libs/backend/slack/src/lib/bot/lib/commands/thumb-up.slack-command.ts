import { Injectable } from '@nestjs/common';
import { CqrsServiceFacade, StorageServiceFacade, ThumbUpCommand } from '@sdj/backend/core';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class ThumbUpSlackCommand implements SlackCommand {
  description: string = ' the song will be played more often';
  type: string = ':+1:';

  constructor(
    private readonly cqrsServiceFacade: CqrsServiceFacade,
    private slack: SlackService,
    private readonly storageService: StorageServiceFacade
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (!currentTrackInQueue) {
      return;
    }

    this.cqrsServiceFacade
      .thumbUp(new ThumbUpCommand(currentTrackInQueue.id, message.user))
      .then(() => {
        this.slack.rtm.sendMessage(
          'Super! (' +
            currentTrackInQueue.track.title +
            ') będzie grana częściej',
          message.channel
        );
      });
  }
}
