import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as redis from 'redis';
import * as socketIo from 'socket.io';
import * as http from 'http';
import 'reflect-metadata';
import { initializeBot } from './bot';
import { DbService } from './services/db.service';
import { PlaylistService } from './services/playlist.service';
import { SocketIoo } from './sio';

const playlist = PlaylistService.getInstance();

const app = express();
const server = new http.Server(app);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const sio = socketIo(server);
SocketIoo.sio = sio;

app.get('/next', (req, res) => {
  playlist.getNext().subscribe(queuedTrack => {
    if (queuedTrack) {
      res.send(`/tracks/${queuedTrack.track.id}.mp3`);
      playlist.removeQueuedTrack(queuedTrack).subscribe();
    } else {
      res.send('/tracks/10-sec-of-silence.mp3');
    }
  });
});

app.get('/', function(req, res) {
  res.render('index');
});

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
