import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { PlaylistStore, HeartCommand } from '@sdj/backend/core';
import { QueuedTrack } from '@sdj/backend/db';

@Injectable()
export class HeartSlackCommand implements SlackCommand {
  description = '`+3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type = ':heart:';

  constructor(
    private readonly commandBus: CommandBus,
    private readonly playlistStore: PlaylistStore,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = <QueuedTrack>(
      await this.playlistStore.getCurrentTrack(message.channel)
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
