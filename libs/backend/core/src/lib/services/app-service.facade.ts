import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared/domain';

@Injectable()
export class AppServiceFacade {
  constructor(
    @Inject(Injectors.APPSERVICE) private readonly client: ClientProxy
  ) {}

  playDj(channelId: string): void {
    this.client.emit(MicroservicePattern.playDj, channelId).subscribe();
  }

  playSilence(channelId: string): void {
    this.client.emit(MicroservicePattern.playSilence, channelId).subscribe();
  }

  pozdro(channelId: string, pozdro: string): void {
    this.client
      .send(MicroservicePattern.pozdro, { channelId, text: pozdro })
      .subscribe();
  }
}
