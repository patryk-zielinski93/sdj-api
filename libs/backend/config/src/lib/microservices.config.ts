import { Transport, ClientOptions } from '@nestjs/microservices';

export const microservices: { [key: string]: ClientOptions } = {
  app: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbit:5672`],
      queue: 'sdj_app',
      queueOptions: { durable: false }
    }
  },
  cqrs: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbit:5672`],
      queue: 'sdj_cqrs',
      queueOptions: { durable: false }
    }
  },
  ices: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbit:5672`],
      queue: 'sdj_ices',
      queueOptions: { durable: false }
    }
  },
  slack: {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbit:5672`],
      queue: 'sdj_slack',
      queueOptions: { durable: false }
    }
  },
  storage: {
    transport: Transport.REDIS,
    options: {
      url: 'redis://redis:6379'
    }
  }
};
