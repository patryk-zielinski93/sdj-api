import { Injectable } from '@nestjs/common';
import {
  RadioFacade,
  ThumbUpCommand
} from '@sdj/backend/radio/core/application-services';
import { Store } from '@sdj/backend/radio/infrastructure';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class ThumbUpSlackCommand implements SlackCommand {
  description: string = ' the song will be played more often';
  type: string = ':+1:';

  constructor(
    private readonly radioFacade: RadioFacade,
    private slack: SlackService,
    private readonly storageService: Store
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (!currentTrackInQueue) {
      return;
    }

    this.radioFacade
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
