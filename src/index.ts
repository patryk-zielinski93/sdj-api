import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as redis from 'redis';
import 'reflect-metadata';
import * as socketIo from 'socket.io';
import { initializeBot } from './bot';
import { pathConfig } from './configs/path.config';
import { Track } from './entities/track.model';
import { DbService } from './services/db.service';
import { IcesService } from './services/ices.service';
import { Mp3Service } from './services/mp3.service';
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

app.get('/ices', (req, res) => {
  IcesService.nextSong();
  res.sendStatus(204);
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
  playlist.getNext().subscribe(async queuedTrack => {
    console.log(channel, message);
    if (queuedTrack) {
      count = 0;
      sio.of('/').emit('play_dj', queuedTrack);
      client.set('next_song', queuedTrack.track.id);
      playlist.updateQueuedTrackPlayedAt(queuedTrack).subscribe();
    } else {
      const connection = await DbService.getConnectionPromise();
      const trackRepository = connection.getRepository(Track);
      const randTrack = await trackRepository.createQueryBuilder('track')
        .orderBy('RAND()')
        .getOne();
      if (randTrack) {
        if (!fs.existsSync(pathConfig.tracks + '/' + randTrack.id + '.mp3')) {
          const mp3 = Mp3Service.getInstance();
          await mp3.downloadAndNormalize(randTrack.id);
        }
        client.set('next_song', randTrack.id);
      } else {
        count = count + 1;
        client.set('next_song', '10-sec-of-silence');
        if (count > 1) {
          sio.of('/').emit('play_radio');
        }
      }
    }
  });
});

sub.subscribe('getNext');

server.listen(8888, () => console.log('Example app listening on port 8888!'));

initializeBot();
