import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { PlayRadioEvent } from '../../events/play-radio.event';
import { PlaySilenceCommand } from '../commands/play-silence.command';

@CommandHandler(PlaySilenceCommand)
export class PlaySilenceHandler implements ICommandHandler<PlaySilenceCommand> {
  constructor(
    private readonly publisher: EventBus,
    private redisService: RedisService,
    private readonly playlistStore: PlaylistStore,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async execute(command: PlaySilenceCommand) {
    const count =
      this.playlistStore.getChannelState(command.channelId).silenceCount + 1;
    this.playlistStore.setSilenceCount(command.channelId, count);
    const prevTrack = await this.playlistStore.getCurrentTrack(
      command.channelId
    );
    if (prevTrack) {
      this.playlistStore.removeFromQueue(prevTrack);
    }
    if (count > 1) {
      this.publisher.publish(new PlayRadioEvent(command.channelId));
    }
    this.redisService
      .getNextSongSubject(command.channelId)
      .next('10-sec-of-silence');
    this.playlistStore.setCurrentTrack(command.channelId, null);
  }
}
