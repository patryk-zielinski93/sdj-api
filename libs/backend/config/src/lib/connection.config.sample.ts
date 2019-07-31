import * as path from 'path';

export const connectionConfig = {
  ices: {
    host: 'ices',
    port: 8888
  },
  redis: {
    host: 'redis',
    port: 6379
  },
  slack: {
    token: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx'
  },
  tracks: {
    directory: path.join(__dirname, 'public', 'tracks'),
    normalizationDb: 92
  },
  youtube: {
    apiKey: 'xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
};
