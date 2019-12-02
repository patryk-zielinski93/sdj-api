import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CqrsServiceFacade,
  DownloadTrackCommand,
  QueueTrackCommand
} from '@sdj/backend/core';
import { QueuedTrackRepository, Track, TrackRepository } from '@sdj/backend/db';
import { appConfig } from '@sdj/backend/shared/config';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class RandSlackCommand implements SlackCommand {
  description: string = 'wylosuję pioseneczkę i dodam do listy utworów';
  type: string = 'rand';

  constructor(
    private readonly cqrsServiceFacade: CqrsServiceFacade,
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
      this.cqrsServiceFacade
        .downloadTrack(new DownloadTrackCommand(randTrack.id))
        .then(() => {
          this.queueTrack(message, randTrack);
        });
    }
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    this.cqrsServiceFacade
      .queueTrack(
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
