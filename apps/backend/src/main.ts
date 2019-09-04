import { App } from './app';
import { Logger } from '@nestjs/common';

const app = new App();
app.bootstrap().then(() => {
  Logger.log('Slack Dj is working!!!');
});
