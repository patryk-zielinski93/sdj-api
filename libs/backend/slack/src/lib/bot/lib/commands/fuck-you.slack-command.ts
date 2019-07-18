import { FuckYouCommand, PlaylistStore } from '@sdj/backend/core';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class FuckYouSlackCommand implements SlackCommand {
  description = '`-3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
  type = ':middle_finger:';

  constructor(
    private readonly commandBus: CommandBus,
    private readonly playlistStore: PlaylistStore,
    private readonly slackService: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.playlistStore.getCurrentTrack(
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
