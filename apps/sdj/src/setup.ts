import * as fs from 'fs';
import * as path from 'path';

fs.readFile(path.join(__dirname + '/env.sample.js'), 'utf8', function(
  err,
  data
) {
  if (err) {
    return console.log(err);
  }
  const result = data
    .replace(/{{backendUrl}}/g, process.env.BACKEND_URL)
    .replace(/{{radioStreamUrl}}/g, process.env.RADIO_STREAM_URL)
    .replace(/{{slackClientId}}/g, process.env.SLACK_CLIENT_ID)
    .replace(/{{slackClientSecret}}/g, process.env.SLACK_CLIENT_SECRET);

  fs.writeFile(path.join(__dirname + '/env.js'), result, 'utf8', function(
    error
  ) {
    if (error) return console.log(error);
  });
});
