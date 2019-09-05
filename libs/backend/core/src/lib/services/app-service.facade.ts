import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';

@Injectable()
export class AppServiceFacade {
  playSilence(channelId: string): void {
    this.client.emit(MicroservicePattern.playSilence, channelId).subscribe();
  }
  constructor(
    @Inject(Injectors.APPSERVICE) private readonly client: ClientProxy
  ) {}

  playDj(channelId: string): void {
    this.client.emit(MicroservicePattern.playDj, channelId).subscribe();
  }
}
