import { ICommand } from '@nestjs/cqrs';

export class DeleteTrackCommand implements ICommand {
    constructor(public trackId: string) {
    }
}