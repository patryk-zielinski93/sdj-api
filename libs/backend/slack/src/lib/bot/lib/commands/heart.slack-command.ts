import { Injectable } from '@nestjs/common';
import { StorageServiceFacade } from '@sdj/backend/core';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { CqrsServiceFacade } from '@sdj/backend/core';
import { HeartCommand } from '@sdj/backend/core';

@Injectable()
export class HeartSlackCommand implements SlackCommand {
  description: string =
    '`+3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type: string = ':heart:';

  constructor(
    private readonly cqrsServiceFacade: CqrsServiceFacade,
    private readonly storageService: StorageServiceFacade,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (currentTrackInQueue) {
      this.cqrsServiceFacade
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
