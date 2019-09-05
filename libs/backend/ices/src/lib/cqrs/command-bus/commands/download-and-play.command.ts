import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '@sdj/backend/db';

export class DownloadAndPlayCommand implements ICommand {
  constructor(public queuedTrack: QueuedTrack) {}
}
