import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueuedTrackDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { Store } from '@sdj/backend/radio/infrastructure';
import { DeleteQueuedTrackCommand } from './delete-queued-track.command';

@CommandHandler(DeleteQueuedTrackCommand)
export class DeleteQueuedTrackHandler
  implements ICommandHandler<DeleteQueuedTrackCommand> {
  constructor(
    private readonly queuedTrackRepository: QueuedTrackDomainRepository,
    private readonly storageService: Store
  ) {}

  async execute(command: DeleteQueuedTrackCommand): Promise<unknown> {
    // TODO CASCADE DELETE
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );
    await this.queuedTrackRepository.remove(queuedTrack);
    return this.storageService.removeFromQueue(queuedTrack);
  }
}
