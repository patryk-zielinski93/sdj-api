import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { appConfig } from '../../../../../configs/app.config';
import { pathConfig } from '../../../../../configs/path.config';
import { Track } from '../../../../shared/modules/db/entities/track.model';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../shared/modules/db/repositories/track.repository';
import { Mp3Service } from '../../../../shared/services/mp3.service';
import { SlackService } from '../../../services/slack.service';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class RandCommand implements Command {
  description = 'wylosuję pioseneczkę i dodam do listy utworów';
  type = 'rand';

  constructor(private mp3: Mp3Service,
              private slack: SlackService,
              @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
              @InjectRepository(TrackRepository) private trackRepository: TrackRepository
  ) {
  }

  async handler(command: string[], message: any): Promise<any> {
    const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(message.user);

    if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
      this.slack.rtm.sendMessage(`Osiągnąłeś limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
      throw new Error('zakolejkowane');
    }

    const randTrack = await this.trackRepository.getRandomTrack();

    if (randTrack) {
      if (!fs.existsSync(pathConfig.tracks + '/' + randTrack.id + '.mp3')) {
        await this.mp3.downloadAndNormalize(randTrack.id);
      }
      this.queueTrack(message, randTrack);
    }
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    this.queuedTrackRepository.queueTrack(track, true, message.user);
    this.slack.rtm.sendMessage(`Dodałem ${track.title} do playlisty :)`, message.channel);
  }
}
