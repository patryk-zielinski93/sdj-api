import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { PlaylistStore } from '@sdj/backend/core';
import { QueuedTrackRepository } from '@sdj/backend/db';

@Injectable()
export class LsSlackCommand implements SlackCommand {
  description: string = 'obczaj listę utworów';
  type: string = 'ls';

  constructor(
    private slack: SlackService,
    private readonly playlistStore: PlaylistStore,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const queuedTracks = await this.queuedTrackRepository.findQueuedTracks(
      message.channel
    );

    let msg = '';

    const currentTrack = await this.playlistStore.getCurrentTrack(
      message.channel
    );
    if (currentTrack) {
      msg +=
        `Teraz gram: ${currentTrack.track.title}, dodane przez ${
          currentTrack.addedBy ? currentTrack.addedBy.realName : 'BOT'
        }` +
        (currentTrack.randomized ? ' (rand)' : '') +
        '\n';
    }

    queuedTracks.forEach((queuedTrack, index) => {
      msg +=
        `${index + 1}. ${queuedTrack.track.title}, dodane przez ${
          queuedTrack.addedBy ? queuedTrack.addedBy.realName : 'BOT'
        }` +
        (queuedTrack.randomized ? ' (rand)' : '') +
        '\n';
    });

    if (!msg.length) {
      this.slack.rtm.sendMessage('Brak utworów na liście.', message.channel);
    } else {
      this.slack.rtm.sendMessage(msg, message.channel);
    }
  }
}
