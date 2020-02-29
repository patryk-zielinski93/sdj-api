import { ICommand } from '@nestjs/cqrs';
import { User } from '@sdj/backend/radio/core/domain';

export class CreateTrackCommand implements ICommand {
  constructor(public id: string, public addedBy: User) {}
}
