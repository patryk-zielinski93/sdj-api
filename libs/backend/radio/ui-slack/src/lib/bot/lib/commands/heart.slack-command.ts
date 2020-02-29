import { Injectable } from '@nestjs/common';
import {
  HeartCommand,
  RadioFacade
} from '@sdj/backend/radio/core/application-services';
import { Store } from '@sdj/backend/radio/infrastructure';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class HeartSlackCommand implements SlackCommand {
  description: string =
    '`+3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type: string = ':heart:';

  constructor(
    private readonly radioFacade: RadioFacade,
    private readonly storageService: Store,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (currentTrackInQueue) {
      this.radioFacade
        .heart(new HeartCommand(currentTrackInQueue.id, message.user))
        .then(_ =>
          this.slackService.rtm.sendMessage(
            ':heart: ' + currentTrackInQueue.track.title,
            message.channel
          )
        )
        .catch(_ =>
          this.slackService.rtm.sendMessage(
            'Co ty pedał jesteś?',
            message.channel
          )
        );
    }
    return;
  }
}
