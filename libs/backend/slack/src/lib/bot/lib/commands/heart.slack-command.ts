import { Injectable, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { HeartCommand } from '@sdj/backend/core';
import { QueuedTrack } from '@sdj/backend/db';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class HeartSlackCommand implements SlackCommand {
  description: string =
    '`+3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type: string = ':heart:';

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = <QueuedTrack>(
      await this.storageService
        .send(MicroservicePattern.getCurrentTrack, message.channel)
        .toPromise()
    );
    if (currentTrackInQueue) {
      this.commandBus
        .execute(new HeartCommand(currentTrackInQueue.id, message.user))
        .then(value => {
          if (value) {
            this.slackService.rtm.sendMessage(
              ':heart: ' + currentTrackInQueue.track.title,
              message.channel
            );
          } else {
            this.slackService.rtm.sendMessage(
              'Co ty pedał jesteś?',
              message.channel
            );
          }
        });
    }
    return;
  }
}
