import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteQueuedTrackCommand, StorageServiceFacade } from '@sdj/backend/core';
import { QueuedTrackRepository } from '@sdj/backend/db';

@CommandHandler(DeleteQueuedTrackCommand)
export class DeleteQueuedTrackHandler implements ICommandHandler<DeleteQueuedTrackCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private readonly queuedTrackRepository: QueuedTrackRepository,
    private readonly storageService: StorageServiceFacade
  ) {
  }

  async execute(command: DeleteQueuedTrackCommand): Promise<unknown> {
    // TODO CASCADE DELETE
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(command.queuedTrackId);
    await this.queuedTrackRepository.remove(queuedTrack);
    return this.storageService.removeFromQueue(queuedTrack);
  }
}
