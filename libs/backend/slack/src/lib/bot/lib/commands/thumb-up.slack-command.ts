import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { StorageServiceFacade, ThumbUpCommand } from '@sdj/backend/core';
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
    private readonly commandBus: CommandBus,
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
