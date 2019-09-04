import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SlackModule } from '@sdj/backend/slack';
import { AppModule } from './app/app.module';
import { IcesModule } from '@sdj/backend/ices';
import { StorageModule } from '@sdj/backend/storage';
import * as cors from 'cors';
import { microservices } from '@sdj/backend/config';

export class App {
  app: INestApplication;
  globalPrefix: string = 'api';
  port: number = parseInt(process.env.PORT, 10) || 8888;

  async bootstrap(): Promise<unknown> {
    this.initApp();
    return this.bootstrapMicroservices();
  }

  async bootstrapMicroservices(): Promise<unknown> {
    return Promise.all([
      this.bootstrapSlackService(),
      this.bootstrapIces(),
      this.bootstrapStorage()
    ]);
  }

  async bootstrapSlackService(): Promise<void> {
    const microservice = await NestFactory.createMicroservice(
      SlackModule,
      microservices.slack
    );
    microservice.listen(() => Logger.log('SlackService is listening'));
  }
  async bootstrapIces(): Promise<void> {
    const microservice = await NestFactory.createMicroservice(
      IcesModule,
      microservices.ices
    );
    microservice.listen(() => Logger.log('Ices is listening'));
  }

  async bootstrapStorage(): Promise<void> {
    const microservice = await NestFactory.createMicroservice(
      StorageModule,
      microservices.storage
    );
    microservice.listen(() => Logger.log('Storage is listening'));
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
