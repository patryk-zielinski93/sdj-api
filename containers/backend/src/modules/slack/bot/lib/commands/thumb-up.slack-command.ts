import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ThumbUpCommand } from '../../../../core/cqrs/command-bus/commands/thumb-up.command';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class ThumbUpSlackCommand implements SlackCommand {
    description = ' the song will be played more often';
    type = ':+1:';

    constructor(private readonly commandBus: CommandBus,
                private slack: SlackService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository
    ) {
    }

    async handler(command: string[], message: any): Promise<any> {
        const currentTrackInQueue = await this.queuedTrackRepository.getCurrentTrack();
        if (!currentTrackInQueue) {
            return;
        }

        this.commandBus.execute(new ThumbUpCommand(currentTrackInQueue.id, message.user))
            .then(() => {
                this.slack.rtm.sendMessage('Super! (' + currentTrackInQueue.track.title + ') będzie grana częściej', message.channel);
            });
    };

}
