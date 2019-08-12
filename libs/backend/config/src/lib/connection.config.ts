import { ClientOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

export const connectionConfig: {microservices: ClientOptions} | any = {
  ices: {
    host: 'ices',
    port: 8888
  },
  microservices: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbit:5672`],
      queue: 'sdj',
      queueOptions: { durable: false },
    },
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