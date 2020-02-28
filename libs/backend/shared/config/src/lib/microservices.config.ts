import { ClientOptions, Transport } from '@nestjs/microservices';
import { connectionConfig } from '@sdj/backend/shared/config';

export const microservices: { [key: string]: ClientOptions } = {
  app: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${connectionConfig.rabbit.host}:${connectionConfig.rabbit.port}`],
      queue: 'sdj_app',
      queueOptions: { durable: false }
    }
  },
  cqrs: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${connectionConfig.rabbit.host}:${connectionConfig.rabbit.port}`],
      queue: 'sdj_cqrs',
      queueOptions: { durable: false }
    }
  },
  ices: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${connectionConfig.rabbit.host}:${connectionConfig.rabbit.port}`],
      queue: 'sdj_ices',
      queueOptions: { durable: false }
    }
  },
  slack: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${connectionConfig.rabbit.host}:${connectionConfig.rabbit.port}`],
      queue: 'sdj_slack',
      queueOptions: { durable: false }
    }
  },
  storage: {
    transport: Transport.REDIS,
    options: {
      url: `redis://${connectionConfig.redis.host}:${connectionConfig.redis.port}`
    }
  }
};
