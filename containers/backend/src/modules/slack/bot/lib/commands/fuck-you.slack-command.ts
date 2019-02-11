import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FuckYouCommand } from '../../../../core/cqrs/command-bus/commands/fuck-you.command';
import { QueuedTrack } from '../../../../core/modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class FuckYouSlackCommand implements SlackCommand {
    description = '`-3` do rankingu dla aktualnie granej piosenki (raz dziennie)';
    type = ':middle_finger:';

    constructor(private readonly commandBus: CommandBus,
                private readonly slackService: SlackService,
                @InjectRepository(QueuedTrackRepository) private readonly queuedTrackRepository: QueuedTrackRepository) {
    }

    async handler(command: string[], message: any): Promise<any> {
        //ToDo true current track is in redis
        const currentTrackInQueue = <QueuedTrack>await this.queuedTrackRepository.getCurrentTrack();
        this.commandBus.execute(new FuckYouCommand(currentTrackInQueue.id, message.user))
            .then((value) => {
                if (value) {
                    this.slackService.rtm.sendMessage('Jebać ' + currentTrackInQueue.track.title, message.channel);
                } else {
                    this.slackService.rtm.sendMessage('Wyraziłeś już dość swojej nienawiści na dziś ', message.channel);
                }
            });
        return;
    }
}
