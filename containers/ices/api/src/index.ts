import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import { spawn } from 'child_process';

const app = express();
const server = new http.Server(app);
app.use(bodyParser.json());

app.get('/', function(req, res) {
  const signal = spawn('bash', ['-c', 'kill -s SIGUSR1 $(pgrep -f ices)']);

  signal.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  signal.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  signal.on('close', code => {
    console.log(`child process exited with code ${code}`);

    code === 0 ? res.sendStatus(204) : res.sendStatus(500);
  });

});

server.listen(8888, () => console.log('Ices Api listening on 8888'));
