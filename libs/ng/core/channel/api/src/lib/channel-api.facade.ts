import { Injectable } from '@angular/core';
import { ChannelFacade } from '@sdj/ng/core/channel/application-services';

@Injectable()
export class ChannelApiFacade {
  selectedChannel$ = this.facade.selectedChannel$;

  constructor(private facade: ChannelFacade) {}
}
