import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTrackHandler } from './commands/create-track/create-track.handler';
import { DeleteQueuedTrackHandler } from './commands/delete-queued-track/delete-queued-track.handler';
import { DeleteTrackHandler } from './commands/delete-track/delete-track.handler';
import { DownloadTrackHandler } from './commands/download-track/download-track.handler';
import { FuckYouHandler } from './commands/fuck-you/fuck-you.handler';
import { HeartHandler } from './commands/heart/heart.handler';
import { PlayTrackHandler } from './commands/play-track/play-track.hander';
import { QueueTrackHandler } from './commands/queue-track/queue-track.handler';
import { ThumbDownHandler } from './commands/thumb-down/thumb-down.handler';
import { ThumbUpHandler } from './commands/thumb-up/thumb-up.handler';
import { PlayQueuedTrackHandler } from './events/play-queued-track/play-queued-track.handler';
import { PlaySilenceHandler } from './events/play-silence/play-silence.handler';
import { PlaylistService } from './playlist.service';
import { RadioFacade } from './radio.facade';

export const CommandHandlers = [
  CreateTrackHandler,
  DeleteQueuedTrackHandler,
  DeleteTrackHandler,
  DownloadTrackHandler,
  FuckYouHandler,
  HeartHandler,
  PlayTrackHandler,
  QueueTrackHandler,
  ThumbDownHandler,
  ThumbUpHandler
];

export const EventsHandlers = [PlayQueuedTrackHandler, PlaySilenceHandler];

@Module({
  imports: [CqrsModule],
  providers: [
    RadioFacade,
    PlaylistService,
    ...CommandHandlers,
    ...EventsHandlers
  ],
  exports: [RadioFacade, PlaylistService]
})
export class BackendRadioCoreApplicationServicesModule {}
