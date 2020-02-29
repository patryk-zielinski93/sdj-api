import { Injectable } from '@nestjs/common';
import {
  AddTrackToQueueCommand,
  RadioFacade
} from '@sdj/backend/radio/core/application-services';
import { TrackDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { extractVideoIdFromYoutubeUrl } from '@sdj/backend/shared/util-you-tube';
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
    private readonly radioFacade: RadioFacade,
    private slack: SlackService,
    private readonly trackRepository: TrackDomainRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    const link = command[1].slice(1, -1);
    const trackId = extractVideoIdFromYoutubeUrl(link);
    this.radioFacade
      .playTrack(
        new AddTrackToQueueCommand(link, message.channel, message.user)
      )
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
