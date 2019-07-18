import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ThumbUpCommand } from '../../../../core/cqrs/command-bus/commands/thumb-up.command';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { PlaylistStore } from '../../../../core/store/playlist.store';

@Injectable()
export class ThumbUpSlackCommand implements SlackCommand {
  description = ' the song will be played more often';
  type = ':+1:';

  constructor(
    private readonly commandBus: CommandBus,
    private slack: SlackService,
    private readonly playlistStore: PlaylistStore,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const currentTrackInQueue = await this.playlistStore.getCurrentTrack(
      message.channel
    );
    console.log(currentTrackInQueue);
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
