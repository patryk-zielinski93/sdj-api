import { Injectable, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThumbUpCommand } from '@sdj/backend/core';

import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ThumbUpSlackCommand implements SlackCommand {
  description: string = ' the song will be played more often';
  type: string = ':+1:';

  constructor(
    private readonly commandBus: CommandBus,
    private slack: SlackService,
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.storageService
      .send(MicroservicePattern.getCurrentTrack, message.channel)
      .toPromise();
    if (!currentTrackInQueue) {
      return;
    }

    this.commandBus
      .execute(new ThumbUpCommand(currentTrackInQueue.id, message.user))
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
