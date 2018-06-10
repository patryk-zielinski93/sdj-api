import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as redis from 'redis';
import 'reflect-metadata';
import { initializeBot } from './bot';
import { PlaylistService } from './services/playlist.service';

const app = express();
app.use(bodyParser.json());

app.listen(8888, () => console.log('Example app listening on port 8888!'));

const client = redis.createClient({
  host: 'redis'
});
const sub = redis.createClient({
  host: 'redis'
});

const playlist = PlaylistService.getInstance();

sub.on('message', (channel, message) => {
  playlist.getNext().subscribe(queuedTrack => {
    console.log(channel, message);
    if (queuedTrack) {
      client.set('next_song', `/tracks/${queuedTrack.track.id}.mp3`);
      playlist.removeQueuedTrack(queuedTrack).subscribe();
    } else {
      client.set('next_song', '/tracks/10-sec-of-silence.mp3');
    }
  });
});

sub.subscribe('getNext');

initializeBot();
