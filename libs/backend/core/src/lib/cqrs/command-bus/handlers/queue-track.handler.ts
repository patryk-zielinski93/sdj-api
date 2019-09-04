import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository, QueuedTrackRepository, TrackRepository } from '@sdj/backend/db';
import { QueueTrackCommand } from '../commands/queue-track.command';
import { StorageServiceFacade } from '../../../services/storage-service.facade';

@CommandHandler(QueueTrackCommand)
export class QueueTrackHandler implements ICommandHandler<QueueTrackCommand> {
  constructor(
    private readonly storageService: StorageServiceFacade,
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
    await this.storageService.addToQueue(queuedTrack);
  }
}
