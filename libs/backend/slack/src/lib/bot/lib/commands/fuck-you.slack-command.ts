import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { FuckYouCommand } from '@sdj/backend/core';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class FuckYouSlackCommand implements SlackCommand {
  description: string =
    '`-3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type: string = ':middle_finger:';

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService
      .send(MicroservicePattern.getCurrentTrack, message.channel)
      .toPromise();
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
