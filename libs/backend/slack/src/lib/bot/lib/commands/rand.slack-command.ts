import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { QueuedTrackRepository, TrackRepository, Track } from '@sdj/backend/db';
import { appConfig } from '@sdj/backend/config';
import { DownloadTrackCommand, QueueTrackCommand } from '@sdj/backend/core';

@Injectable()
export class RandSlackCommand implements SlackCommand {
  description = 'wylosuję pioseneczkę i dodam do listy utworów';
  type = 'rand';

  constructor(
    private readonly commandBus: CommandBus,
    private slack: SlackService,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(
      message.user,
      message.channel
    );

    if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
      this.slack.rtm.sendMessage(
        `Osiągnąłeś limit ${
          appConfig.queuedTracksPerUser
        } zakolejkowanych utworów.`,
        message.channel
      );
      throw new Error('zakolejkowane');
    }

    const randTrack = await this.trackRepository.getRandomTrack(
      message.channel
    );

    if (randTrack) {
      this.commandBus
        .execute(new DownloadTrackCommand(randTrack.id))
        .then(() => {
          this.queueTrack(message, randTrack);
        });
    }
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    this.commandBus
      .execute(
        new QueueTrackCommand(track.id, message.channel, message.user, true)
      )
      .then(() => {
        this.slack.rtm.sendMessage(
          `Dodałem ${track.title} do playlisty :)`,
          message.channel
        );
      });
  }
}
