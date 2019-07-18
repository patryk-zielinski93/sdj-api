import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { QueuedTrackRepository, TrackRepository, UserRepository, Track, User } from '@sdj/backend/db';
import { appConfig } from '@sdj/backend/config';
import { Utils, DownloadTrackCommand, CreateTrackCommand, QueueTrackCommand } from '@sdj/backend/core';

@Injectable()
export class PlayTrackSlackCommand implements SlackCommand {
  description =
    '`[youtubeUrl]` - jeżeli chcesz żebym zapuścił Twoją pioseneczkę, koniecznie wypróbuj to polecenie';
  type = 'play';

  constructor(
    private readonly commandBus: CommandBus,
    private slack: SlackService,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    //ToDO move to QueueTrackHandler
    const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(
      message.user,
      message.channel
    );

    if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
      this.slack.rtm.sendMessage(
        `Masz przekroczony limit ${
          appConfig.queuedTracksPerUser
        } zakolejkowanych utworów.`,
        message.channel
      );
      throw new Error('zakolejkowane');
    }

    const id = Utils.extractVideoIdFromYoutubeUrl(command[1].slice(1, -1));
    if (!id) {
      throw new Error('invalid url');
    }

    const track = await this.trackRepository.findOne(id);
    const user = await this.userRepository.findOneOrFail(message.user);

    if (track) {
      if (track.skips >= appConfig.skipsToBan) {
        //ToDO move to QueueTrackHandler
        console.log('Song is banned');
        return;
      }

      this.commandBus.execute(new DownloadTrackCommand(track.id)).then(() => {
        this.queueTrack(message, track, user);
      });
    } else {
      this.commandBus.execute(new CreateTrackCommand(id, user)).then(async () => {
        const newTrack = await this.trackRepository.findOneOrFail(id);
        this.queueTrack(message, newTrack, user);
      });
    }
  }

  private async queueTrack(
    message: SlackMessage,
    track: Track,
    user: User
  ): Promise<void> {
    this.commandBus
      .execute(new QueueTrackCommand(track.id, message.channel, user))
      .then(() => {
        this.slack.rtm.sendMessage(
          `Dodałem ${track.title} do playlisty :)`,
          message.channel
        );
      });
  }
}
