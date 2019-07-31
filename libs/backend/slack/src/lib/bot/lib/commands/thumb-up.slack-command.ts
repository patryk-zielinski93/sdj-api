import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PlaylistStore, ThumbUpCommand } from '@sdj/backend/core';

import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class ThumbUpSlackCommand implements SlackCommand {
  description: string = ' the song will be played more often';
  type: string = ':+1:';

  constructor(
    private readonly commandBus: CommandBus,
    private slack: SlackService,
    private readonly playlistStore: PlaylistStore
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.playlistStore.getCurrentTrack(
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
