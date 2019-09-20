import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '@sdj/backend/config';
import { CqrsServiceFacade, QueueTrackCommand } from '@sdj/backend/core';
import { QueuedTrackRepository, Track, TrackRepository } from '@sdj/backend/db';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class RefreshSlackCommand implements SlackCommand {
  description: string = 'zagram pioseneczkę, która była grana najdawniej';
  type: string = 'refresh';

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

    const groupedTracksQuery = this.queuedTrackRepository
      .createQueryBuilder('queuedTrack')
      .select('trackId, MAX(createdAt) as createdAt')
      .where('queuedTrack.playedIn = :channelId')
      .setParameter('channelId', message.channel)
      .groupBy('trackId');

    const oldestTrack = await this.queuedTrackRepository
      .createQueryBuilder('queuedTrack')
      .select('*')
      .from(`(${groupedTracksQuery.getQuery()})`, 'latest')
      .orderBy('latest.createdAt', 'ASC')
      .where('queuedTrack.playedIn = :channelId')
      .setParameter('channelId', message.channel)
      .limit(1)
      .execute();

    if (oldestTrack[0] && oldestTrack[0].trackId) {
      const trackId = oldestTrack[0].trackId;
      const refreshTrack = await this.trackRepository.findOne(trackId);
      if (refreshTrack) {
        this.queueTrack(message, refreshTrack);
      }
    }
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    this.cqrsServiceFacade
      .queueTrack(
        new QueueTrackCommand(track.id, message.channel, message.user, true)
      )
      .then(_ =>
        this.slack.rtm.sendMessage(
          `Odświeżamy! Dodałem ${track.title} do playlisty :)`,
          message.channel
        )
      )
      .catch(error => {
        this.slack.rtm.sendMessage(error.message, message.channel);
      });
  }
}
