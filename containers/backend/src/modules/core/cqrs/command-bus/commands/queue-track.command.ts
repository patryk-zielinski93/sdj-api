import { ICommand } from '@nestjs/cqrs';
import { User } from '../../../modules/db/entities/user.entity';

export class QueueTrackCommand implements ICommand {
    constructor(public trackId: string, public channelId: string, public addedBy?: User, public randomized = false) {
    }

}
