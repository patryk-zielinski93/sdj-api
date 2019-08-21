import { INestApplication, INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { connectionConfig } from '@sdj/backend/config';
import { RedisModule } from '@sdj/backend/redis';
import { SlackModule } from '@sdj/backend/slack';
import * as cors from 'cors';
import { AppModule } from './app/app.module';
class App {
  app: INestApplication;
  globalPrefix: string = 'api';
  port: number = parseInt(process.env.PORT, 10) || 8888;

  async bootstrap(): Promise<unknown> {
    this.initApp();
    return this.bootstrapMicroservices();
  }

  async bootstrapMicroservices(): Promise<unknown> {
    return Promise.all([this.bootstrapSlackService(), this.bootstrapRedis()]);
  }

  async bootstrapSlackService(): Promise<void> {
    const microservice = await NestFactory.createMicroservice(
      SlackModule,
      connectionConfig.microservices.slack
    );
    microservice.listen(() => Logger.log('SlackService is listening'));
  }
  async bootstrapRedis(): Promise<void> {
    const microservice = await NestFactory.createMicroservice(
      RedisModule,
      connectionConfig.microservices.redis
    );
    microservice.listen(() => Logger.log('Redis is listening'));
  }

  async initApp(): Promise<void> {
    this.app = await NestFactory.create(AppModule);
    this.app.setGlobalPrefix(this.globalPrefix);
    this.app.use(cors());
    this.app.connectMicroservice(connectionConfig.microservices.app);
    this.app.startAllMicroservices();
    return this.app.listen(this.port, () => {
      Logger.log(
        'Listening at http://localhost:' + this.port + '/' + this.globalPrefix
      );
    });
  }
}

const app = new App();
app.bootstrap();
