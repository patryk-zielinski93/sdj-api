import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppServiceFacade, StorageServiceFacade } from '@sdj/backend/core';
import { RedisService } from '../../../services/redis.service';
import { PlaySilenceCommand } from '../commands/play-silence.command';

@CommandHandler(PlaySilenceCommand)
export class PlaySilenceHandler implements ICommandHandler<PlaySilenceCommand> {
  constructor(
    private readonly appService: AppServiceFacade,
    private redisService: RedisService,
    private readonly storageService: StorageServiceFacade
  ) {}

  async execute(command: PlaySilenceCommand): Promise<unknown> {
    const channelId = command.channelId;
    let count = await this.storageService.getSilenceCount(channelId);
    count++;
    this.storageService.setSilenceCount(channelId, count);
    const prevTrack = await this.storageService.getCurrentTrack(channelId);
    if (prevTrack) {
      this.storageService.removeFromQueue(prevTrack);
    }
    if (count > 1) {
      this.appService.playSilence(channelId);
    }
    this.redisService
      .getNextSongSubject(command.channelId)
      .next(<any>'10-sec-of-silence');
    return this.storageService.setCurrentTrack(channelId, null);
  }
}
