import { ICommand } from '@nestjs/cqrs';
import { User } from '../../../modules/db/entities/user.model';

export class QueueTrackCommand implements ICommand {
    constructor(public trackId: string, public addedBy?: User, public randomized = false) {
    }

}
