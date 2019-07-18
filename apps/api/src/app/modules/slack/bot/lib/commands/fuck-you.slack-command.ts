import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FuckYouCommand } from '../../../../core/cqrs/command-bus/commands/fuck-you.command';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { PlaylistStore } from '../../../../core/store/playlist.store';

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
    const currentTrackInQueue = await this.playlistStore.getCurrentTrack(message.channel);
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
