import { Injectable } from '@nestjs/common';
import {
  FuckYouCommand,
  RadioFacade
} from '@sdj/backend/radio/core/application-services';
import { Store } from '@sdj/backend/radio/infrastructure';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class FuckYouSlackCommand implements SlackCommand {
  description: string =
    '`-3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type: string = ':middle_finger:';

  constructor(
    private readonly cqrsServiceFacade: RadioFacade,
    private readonly storageService: Store,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (currentTrackInQueue) {
      this.cqrsServiceFacade
        .fuckYou(new FuckYouCommand(currentTrackInQueue.id, message.user))
        .then(_ =>
          this.slackService.rtm.sendMessage(
            'Jebać ' + currentTrackInQueue.track.title,
            message.channel
          )
        )
        .catch(_ =>
          this.slackService.rtm.sendMessage(
            'Wyraziłeś już dość swojej nienawiści na dziś ',
            message.channel
          )
        );
    }
    return;
  }
}
