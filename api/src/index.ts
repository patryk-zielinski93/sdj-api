import * as bodyParser from 'body-parser';
import { spawn } from 'child_process';
import * as express from 'express';
import * as http from 'http';

const app = express();
const server = new http.Server(app);
app.use(bodyParser.json());

//TODO VALIDATE ID!!!
app.get('/start/:id', function(req, res) {
    console.log('starting', req.params.id);
    const signal = spawn('bash', ['-c', `cd .. && docker-compose run -d --name slack_dj_ices_${req.params.id} -e ROOM_ID=${req.params.id} slack_dj_ices`]);

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

app.get('/remove/:id', function(req, res) {
    console.log('removing', req.params.id);
    const signal = spawn('bash', ['-c', `cd .. && docker rm -f slack_dj_ices_${req.params.id}`]);

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

server.listen(8887, () => console.log('Docker Api listening on 8888'));
