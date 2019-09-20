import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CqrsServiceFacade, PlayTrackCommand, Utils } from '@sdj/backend/core';
import { TrackRepository } from '@sdj/backend/db';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class PlayTrackSlackCommand implements SlackCommand {
  description: string =
    '`[youtubeUrl]` - jeżeli chcesz żebym zapuścił Twoją pioseneczkę, koniecznie wypróbuj to polecenie';
  type: string = 'play';

  constructor(
    private readonly cqrsServiceFacade: CqrsServiceFacade,
    private slack: SlackService,
    @InjectRepository(TrackRepository)
    private readonly trackRepository: TrackRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const link = command[1].slice(1, -1);
    const trackId = Utils.extractVideoIdFromYoutubeUrl(link);
    this.cqrsServiceFacade
      .playTrack(new PlayTrackCommand(link, message.channel, message.user))
      .then(async () => {
        const track = await this.trackRepository.findOneOrFail(trackId);
        this.slack.rtm.sendMessage(
          `Dodałem ${track.title} do playlisty :)`,
          message.channel
        );
      })
      .catch(err => this.slack.rtm.sendMessage(err.message, message.channel));
  }
}
