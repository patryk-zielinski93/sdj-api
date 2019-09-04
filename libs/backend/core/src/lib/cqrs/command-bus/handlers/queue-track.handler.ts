import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Store } from '../../../../../../storage/src/lib/services/store';
import { QueueTrackCommand } from '../commands/queue-track.command';
import {
  ChannelRepository,
  QueuedTrackRepository,
  TrackRepository
} from '@sdj/backend/db';
import { Inject } from '@nestjs/common';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(QueueTrackCommand)
export class QueueTrackHandler implements ICommandHandler<QueueTrackCommand> {
  constructor(
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy,
    @InjectRepository(ChannelRepository)
    private channelRepository: ChannelRepository,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository)
    private readonly trackRepository: TrackRepository
  ) {}

  async execute(command: QueueTrackCommand): Promise<void> {
    const channel = await this.channelRepository.findOrCreate(
      command.channelId
    );
    const track = await this.trackRepository.findOneOrFail(command.trackId);
    const queuedTrack = await this.queuedTrackRepository.queueTrack(
      track,
      channel,
      command.randomized,
      command.addedBy
    );
    await this.storageService.send(MicroservicePattern.addToQueue, queuedTrack).toPromise();
  }
}
