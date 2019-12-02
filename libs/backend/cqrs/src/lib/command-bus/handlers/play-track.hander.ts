import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTrackCommand,
  DownloadTrackCommand,
  PlayTrackCommand,
  QueueTrackCommand,
  Utils
} from '@sdj/backend/core';
import { Track, TrackRepository, User, UserRepository } from '@sdj/backend/db';

@CommandHandler(PlayTrackCommand)
export class PlayTrackHandler implements ICommandHandler<PlayTrackCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async execute(command: PlayTrackCommand): Promise<void> {
    const { addedById, channelId, link } = command;

    const id = Utils.extractVideoIdFromYoutubeUrl(link);
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
