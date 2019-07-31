import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../repositories/queued-track.repository';
import { TrackRepository } from '../../../repositories/track.repository';
import { DeleteTrackCommand } from '../commands/delete-track.command';

@CommandHandler(DeleteTrackCommand)
export class DeleteTrackHandler implements ICommandHandler<DeleteTrackCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private readonly queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository)
    private readonly trackRepository: TrackRepository
  ) {}

  async execute(command: DeleteTrackCommand): Promise<void> {
    // TODO CASCADE DELETE
    const track = await this.trackRepository.findOneOrFail(command.trackId);
    const queuedTracks = await track.queuedTracks;
    for (const qTrack of queuedTracks) {
      await this.queuedTrackRepository.remove(qTrack);
    }
    await this.trackRepository.remove(track);
  }
}
