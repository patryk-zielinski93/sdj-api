import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../../../../core/src/lib/store/playlist.store';
import { PlaySilenceCommand } from '../commands/play-silence.command';
import { PlayRadioEvent } from '../../events/play-radio.event';
import { Inject } from '@nestjs/common';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(PlaySilenceCommand)
export class PlaySilenceHandler implements ICommandHandler<PlaySilenceCommand> {
  constructor(
    @Inject(Injectors.APPSERVICE) private readonly client: ClientProxy,
    private redisService: RedisService,
    private readonly playlistStore: PlaylistStore
  ) {}

  async execute(command: PlaySilenceCommand): Promise<void> {
    const count =
      (await this.playlistStore.getChannelState(command.channelId))
        .silenceCount + 1;
    this.playlistStore.setSilenceCount(command.channelId, count);
    const prevTrack = await this.playlistStore.getCurrentTrack(
      command.channelId
    );
    if (prevTrack) {
      this.playlistStore.removeFromQueue(prevTrack);
    }
    if (count > 1) {
      this.client
        .emit(MicroservicePattern.playSilence, command.channelId)
        .subscribe();
    }
    this.redisService
      .getNextSongSubject(command.channelId)
      .next(<any>'10-sec-of-silence');
    await this.playlistStore.setCurrentTrack(command.channelId, null);
  }
}
