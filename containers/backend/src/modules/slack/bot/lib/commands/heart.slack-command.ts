import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HeartCommand } from '../../../../core/cqrs/command-bus/commands/heart.command';
import { QueuedTrack } from '../../../../core/modules/db/entities/queued-track.entity';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class HeartSlackCommand implements SlackCommand {
    description = '`+3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
    type = ':heart:';

    constructor(private readonly commandBus: CommandBus,
                private readonly slackService: SlackService,
                @InjectRepository(QueuedTrackRepository) private readonly queuedTrackRepository: QueuedTrackRepository) {
    }

    async handler(command: string[], message: any): Promise<any> {
        const currentTrackInQueue = <QueuedTrack>await this.queuedTrackRepository.getCurrentTrack('');
        if (currentTrackInQueue) {
            this.commandBus.execute(new HeartCommand(currentTrackInQueue.id, message.user))
                .then((value) => {
                    if (value) {
                        this.slackService.rtm.sendMessage(':heart: ' + currentTrackInQueue.track.title, message.channel);
                    } else {
                        this.slackService.rtm.sendMessage('Co ty pedał jesteś?', message.channel);
                    }
                });
        }
        return;
    }
}
