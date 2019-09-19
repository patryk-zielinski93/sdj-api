import { ICommand } from '@nestjs/cqrs';
import { User } from '@sdj/backend/db';

export class CreateTrackCommand implements ICommand {
  constructor(public id: string, public addedBy: User) {}
}
