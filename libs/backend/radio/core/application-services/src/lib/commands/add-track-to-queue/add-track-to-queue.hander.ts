import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Track, User } from '@sdj/backend/radio/core/domain';

import {
  TrackDomainRepository,
  UserDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import { extractVideoIdFromYoutubeUrl } from '@sdj/backend/shared/util-you-tube';
import { CreateTrackCommand } from '../create-track/create-track.command';
import { DownloadTrackCommand } from '../download-track/download-track.command';
import { QueueTrackCommand } from '../queue-track/queue-track.command';
import { AddTrackToQueueCommand } from './add-track-to-queue.command';

@CommandHandler(AddTrackToQueueCommand)
export class PlayTrackHandler
  implements ICommandHandler<AddTrackToQueueCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private trackRepository: TrackDomainRepository,
    private userRepository: UserDomainRepository
  ) {}

  async execute(command: AddTrackToQueueCommand): Promise<void> {
    const { addedById, channelId, link } = command;

    const id = extractVideoIdFromYoutubeUrl(link);
    if (!id) {
      throw new Error('invalid url');
    }

    const track = await this.trackRepository.findOne(id);
    const user = await this.userRepository.findOneOrFail(addedById);
    return new Promise((resolve, reject) => {
      if (track) {
        this.commandBus.execute(new DownloadTrackCommand(track.id)).then(() => {
          this.queueTrack(channelId, track, user)
            .then(resolve)
            .catch(reject);
        });
      } else {
        this.commandBus
          .execute(new CreateTrackCommand(id, user))
          .then(async () => {
            const newTrack = await this.trackRepository.findOneOrFail(id);
            this.queueTrack(channelId, newTrack, user)
              .then(resolve)
              .catch(reject);
          });
      }
    });
  }

  private queueTrack(
    channelId: string,
    track: Track,
    user: User
  ): Promise<void> {
    return this.commandBus.execute(
      new QueueTrackCommand(track.id, channelId, user)
    );
  }
}
