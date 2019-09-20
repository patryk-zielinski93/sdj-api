import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FuckYouCommand, StorageServiceFacade } from '@sdj/backend/core';
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
    private readonly commandBus: CommandBus,
    private readonly storageService: StorageServiceFacade,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService.getCurrentTrack(
      message.channel
    );
    if (currentTrackInQueue) {
      this.commandBus
        .execute(new FuckYouCommand(currentTrackInQueue.id, message.user))
        .then(value => {
          if (value) {
            this.slackService.rtm.sendMessage(
              'Jebać ' + currentTrackInQueue.track.title,
              message.channel
            );
          } else {
            this.slackService.rtm.sendMessage(
              'Wyraziłeś już dość swojej nienawiści na dziś ',
              message.channel
            );
          }
        });
    }
    return;
  }
}
