import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WsPlayQueuedTrackHandler } from './events/play-queued-track/ws-play-queued-track.handler';
import { WsPlaySilenceHandler } from './events/play-silence/ws-play-silence.handler';
import { WsPozdroHandler } from './events/pozdro/ws-pozdro.handler';
import { Gateway } from './gateway';

const EventsHandlers = [
  WsPlayQueuedTrackHandler,
  WsPlaySilenceHandler,
  WsPozdroHandler
];
@Module({
  imports: [CqrsModule],
  providers: [...EventsHandlers, Gateway],
  exports: [Gateway]
})
export class WebSocketModule {}
