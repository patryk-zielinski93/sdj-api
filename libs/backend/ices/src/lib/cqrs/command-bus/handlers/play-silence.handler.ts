import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { RedisService } from '../../../services/redis.service';
import { PlaySilenceCommand } from '../commands/play-silence.command';

@CommandHandler(PlaySilenceCommand)
export class PlaySilenceHandler implements ICommandHandler<PlaySilenceCommand> {
  constructor(
    @Inject(Injectors.APPSERVICE) private readonly client: ClientProxy,
    private redisService: RedisService,
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy
  ) {}

  async execute(command: PlaySilenceCommand): Promise<void> {
    let count = await this.storageService
      .send(MicroservicePattern.getSilenceCount, command.channelId)
      .toPromise();
    count++;
    this.storageService
      .send(MicroservicePattern.setSilenceCount, {
        channelId: command.channelId,
        value: count
      })
      .toPromise();
    const prevTrack = await this.storageService
      .send(MicroservicePattern.getCurrentTrack, command.channelId)
      .toPromise();

    if (prevTrack) {
      this.storageService
        .send(MicroservicePattern.removeFromQueue, prevTrack)
        .toPromise();
    }
    if (count > 1) {
      this.client
        .emit(MicroservicePattern.playSilence, command.channelId)
        .subscribe();
    }
    this.redisService
      .getNextSongSubject(command.channelId)
      .next(<any>'10-sec-of-silence');
    return this.storageService
      .send(MicroservicePattern.setCurrentTrack, {
        channelId: command.channelId,
        queuedTrack: null
      })
      .toPromise();
  }
}
