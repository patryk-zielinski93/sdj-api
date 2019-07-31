import { ICommand } from '@nestjs/cqrs';

export class DownloadTrackCommand implements ICommand {
  constructor(public trackId: string) {}
}
