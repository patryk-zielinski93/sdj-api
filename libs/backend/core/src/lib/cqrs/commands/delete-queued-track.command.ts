import { ICommand } from "@nestjs/cqrs";

export class DeleteQueuedTrackCommand implements ICommand {
  constructor(public queuedTrackId: number) {}
}
