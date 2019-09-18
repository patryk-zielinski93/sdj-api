const io = require('@pm2/io');

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
});

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientOptions } from '@nestjs/microservices';
import { microservices } from '@sdj/backend/config';
import { IcesModule } from '@sdj/backend/ices';
import { SlackModule } from '@sdj/backend/slack';
import { StorageModule } from '@sdj/backend/storage';
import * as cors from 'cors';
import { AppModule } from './app/app.module';

export class App {
  app: INestApplication;
  globalPrefix: string = 'api';
  port: number = parseInt(process.env.PORT, 10) || 8888;

  async bootstrap(): Promise<unknown> {
    return Promise.all([this.initApp(), this.bootstrapMicroservices()]);
  }

  async bootstrapMicroservices(): Promise<unknown> {
    return Promise.all([
      this.bootstrapSlackService(),
      this.bootstrapIces(),
      this.bootstrapStorage()
    ]);
  }

  private async bootstrapService(
    module: any,
    options: ClientOptions,
    name: string
  ): Promise<void> {
    const microservice = await NestFactory.createMicroservice(module, options);
    await microservice.listenAsync();
    Logger.log(name + 'Service is listening');
  }

  async bootstrapSlackService(): Promise<void> {
    return this.bootstrapService(SlackModule, microservices.slack, 'Slack');
  }
  async bootstrapIces(): Promise<void> {
    return this.bootstrapService(IcesModule, microservices.ices, 'Ices');
  }

  async bootstrapStorage(): Promise<void> {
    return this.bootstrapService(
      StorageModule,
      microservices.storage,
      'Storage'
    );
  }

  async initApp(): Promise<void> {
    this.app = await NestFactory.create(AppModule);
    this.app.setGlobalPrefix(this.globalPrefix);
    this.app.use(cors());
    this.app.connectMicroservice(microservices.app);
    this.app.startAllMicroservices();
    return this.app.listen(this.port, () => {
      Logger.log(
        'Listening at http://localhost:' + this.port + '/' + this.globalPrefix
      );
    });
  }
}
