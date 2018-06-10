import * as path from 'path';

export const appConfig = {
  youtube: {
    apiKey: 'xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  slack: {
    token: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx'
  },
  redis: {
    host: 'redis',
    port: 6379
  },
  tracks: {
    directory: path.join(__dirname, 'public', 'tracks'),
    normalizationDb: 92
  }
};
