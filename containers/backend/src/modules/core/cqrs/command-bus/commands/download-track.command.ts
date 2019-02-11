import { ICommand } from '@nestjs/cqrs';
import { Track } from "../../../modules/db/entities/track.model";

export class DownloadTrackCommand implements ICommand {
    constructor(public track: Track) {
    }
}
