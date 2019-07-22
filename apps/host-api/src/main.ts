import * as express from 'express';
import { spawn } from 'child_process';
import { Request, Response } from 'express';

const app = express();

//TODO VALIDATE ID!!!
app.get('/start/:id', function(req: Request, res: Response): void {
  console.log('starting', req.params.id);

  const signal = spawn('bash', [
    '-c',
    `docker-compose run -d  --name slack_dj_ices_${req.params.id} -e ROOM_ID=${
      req.params.id
    } slack_dj_ices`
  ]);

  signal.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  // signal.stderr.on('data', data => {
  //     console.log(`stderr: ${data}`);
  // });

  signal.on('close', code => {
    console.log(`starting exited with code ${code}`);

    code === 0 ? res.sendStatus(204) : res.sendStatus(500);
  });
});

app.get('/remove/:id', function(req: Request, res: Response): void {
  console.log('removing', req.params.id);
  const signal = spawn('bash', [
    '-c',
    `docker rm -f slack_dj_ices_${req.params.id}`
  ]);

  signal.on('close', code => {
    console.log(`removing exited with code ${code}`);

    code === 0 ? res.sendStatus(204) : res.sendStatus(500);
  });
});

app.get('/next/:id', function(req: Request, res: Response): void {
  console.log('removing', req.params.id);
  const signal = spawn('bash', [
    '-c',
    `docker exec slack_dj_ices_${
      req.params.id
    } bash -c "pgrep -f ices | xargs kill -s SIGUSR1"`
  ]);

  signal.on('close', code => {
    console.log(`next exited with code ${code}`);

    code === 0 ? res.sendStatus(204) : res.sendStatus(500);
  });
});

const port = process.env.port || 8887;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
