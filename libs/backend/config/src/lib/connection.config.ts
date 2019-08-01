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
    token: process.env.SLACK_OAUTH_TOKEN
  },
  tracks: {
    directory: path.join(__dirname, 'public', 'tracks'),
    normalizationDb: 92
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY
  }
};