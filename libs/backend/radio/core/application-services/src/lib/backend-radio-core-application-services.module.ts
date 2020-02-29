import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlayTrackHandler } from './commands/add-track-to-queue/add-track-to-queue.hander';
import { CreateTrackHandler } from './commands/create-track/create-track.handler';
import { DeleteQueuedTrackHandler } from './commands/delete-queued-track/delete-queued-track.handler';
import { DeleteTrackHandler } from './commands/delete-track/delete-track.handler';
import { DownloadAndPlayHandler } from './commands/download-and-play/download-and-play.handler';
import { DownloadTrackHandler } from './commands/download-track/download-track.handler';
import { FuckYouHandler } from './commands/fuck-you/fuck-you.handler';
import { HeartHandler } from './commands/heart/heart.handler';
import { PlayNextTrackOrSilenceHandler } from './commands/play-next-track-or-silence/play-next-track-or-silence.handler';
import { QueueTrackHandler } from './commands/queue-track/queue-track.handler';
import { SkipQueuedTrackHandler } from './commands/skip-queued-track/skip-queued-track.handler';
import { ThumbDownHandler } from './commands/thumb-down/thumb-down.handler';
import { ThumbUpHandler } from './commands/thumb-up/thumb-up.handler';
import { PlayQueuedTrackHandler } from './events/play-queued-track/play-queued-track.handler';
import { PlaySilenceHandler } from './events/play-silence/play-silence.handler';
import { SongVotedNegativelyHandler } from './events/song-voted-negatively/song-voted-negatively.handler';
import { RadioFacade } from './radio.facade';

export const CommandHandlers = [
  CreateTrackHandler,
  DeleteQueuedTrackHandler,
  DeleteTrackHandler,
  DownloadAndPlayHandler,
  DownloadTrackHandler,
  FuckYouHandler,
  HeartHandler,
  PlayNextTrackOrSilenceHandler,
  PlayTrackHandler,
  QueueTrackHandler,
  SkipQueuedTrackHandler,
  ThumbDownHandler,
  ThumbUpHandler
];

export const EventsHandlers = [
  PlayQueuedTrackHandler,
  PlaySilenceHandler,
  SongVotedNegativelyHandler
];

@Module({
  imports: [CqrsModule],
  providers: [RadioFacade, ...CommandHandlers, ...EventsHandlers],
  exports: [RadioFacade]
})
export class BackendRadioCoreApplicationServicesModule {}
