import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteTrackCommand } from '@sdj/backend/core';
import { Track, QueuedTrack, VoteRepository, QueuedTrackRepository, TrackRepository } from '@sdj/backend/db';

@CommandHandler(DeleteTrackCommand)
export class DeleteTrackHandler implements ICommandHandler<DeleteTrackCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private readonly queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository)
    private readonly trackRepository: TrackRepository,
    @InjectRepository(VoteRepository)
    private readonly voteRepository: VoteRepository
  ) {}

  async execute(command: DeleteTrackCommand): Promise<void> {
    // TODO CASCADE DELETE
    const track = await this.trackRepository.findOneOrFail(command.trackId);
    const queuedTracks = await track.queuedTracks;
    this.removeQueuedTrackOfTrack(track);
    await this.trackRepository.remove(track);
  }

  // ToDo Optimize for Node
  async removeQueuedTrackOfTrack(track: Track): Promise<void> {
    for (const qTrack of await track.queuedTracks) {
      this.removeVotesForQueuedTrack(qTrack);
      await this.queuedTrackRepository.remove(qTrack);
    }
  }

  async removeVotesForQueuedTrack(queuedTrack: QueuedTrack): Promise<void> {
    for (const vote of await queuedTrack.votes) {
      await this.voteRepository.remove(vote);
    }
  }
}
