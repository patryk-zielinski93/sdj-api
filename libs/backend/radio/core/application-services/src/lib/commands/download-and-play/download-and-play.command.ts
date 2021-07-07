import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '@sdj/backend/radio/core/domain';

export class DownloadAndPlayCommand implements ICommand {
  constructor(public queuedTrack: QueuedTrack) {}
}
