import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as http from 'http';
import * as redis from 'redis';
import 'reflect-metadata';
import * as socketIo from 'socket.io';
import { AppModule } from './app.module';
import { initializeBot } from './bot';
import { PlaylistService } from './services/playlist.service';
import { SocketIoo } from './sio';
import { join } from 'path';

async function bootstrap() {

  const playlist = PlaylistService.getInstance();

  const server = new http.Server(express());
  const sio = socketIo(server);
  SocketIoo.sio = sio;

  const client = redis.createClient({
    host: 'redis'
  });
  const sub = redis.createClient({
    host: 'redis'
  });

  let count = 0;

  sub.on('message', (channel, message) => {
    playlist.getNext().subscribe(queuedTrack => {
      console.log(channel, message);
      if (queuedTrack) {
        count = 0;
        sio.of('/').emit('play_dj', queuedTrack);
        client.set('next_song', queuedTrack.track.id);
        playlist.updateQueuedTrackPlayedAt(queuedTrack).subscribe();
      } else {
        count = count + 1;
        client.set('next_song', '10-sec-of-silence');
        if (count > 1) {
          sio.of('/').emit('play_radio');
        }
      }
    });
  });

  sub.subscribe('getNext');

  server.listen(8888, () => console.log('Example app listening on port 8888!'));

  initializeBot();

  const app = await NestFactory.create(AppModule);

  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'public'));
  app.setViewEngine(<any>{
    engine: {
      handlebars: require('handlebars')
    },
    templates: join(__dirname, 'public')
  });
  await app.listen(8889);
}

bootstrap();
