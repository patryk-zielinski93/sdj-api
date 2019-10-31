const io = require('@pm2/io');

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
});

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientOptions } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { microservices } from '@sdj/backend/config';
import { SdjCqrsModule } from '@sdj/backend/cqrs';
import { IcesModule } from '@sdj/backend/ices';
import { SlackModule } from '@sdj/backend/slack';
import { StorageModule } from '@sdj/backend/storage';
import * as cors from 'cors';
import { join } from 'path';
import { AppModule } from './app/app.module';

export class App {
  app: NestExpressApplication;
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

  async bootstrapCqrs(): Promise<void> {
    this.bootstrapService(SdjCqrsModule, microservices.cqrs, 'CQRS');
  }

  async bootstrapIces(): Promise<void> {
    return this.bootstrapService(IcesModule, microservices.ices, 'Ices');
  }

  async bootstrapSlackService(): Promise<void> {
    return this.bootstrapService(SlackModule, microservices.slack, 'Slack');
  }

  async bootstrapStorage(): Promise<void> {
    return this.bootstrapService(
      StorageModule,
      microservices.storage,
      'Storage'
    );
  }

  async initApp(): Promise<void> {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule);
    this.app.setGlobalPrefix(this.globalPrefix);
    this.app.use(cors());
    this.app.connectMicroservice(microservices.app);
    this.app.startAllMicroservices();
    this.app.useStaticAssets(join(__dirname, 'assets'));

    return this.app.listen(this.port, () => {
      Logger.log(
        'Listening at http://localhost:' + this.port + '/' + this.globalPrefix
      );
    });
  }
}
