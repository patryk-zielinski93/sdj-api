import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { microservices } from '@sdj/backend/shared/config';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { bootstrapCqrs } from './cqrs.main';
import { bootstrapStorage } from './storage.main';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = parseInt(process.env.PORT, 10) || 8888;
  app.connectMicroservice(microservices.app);
  app.startAllMicroservices();
  app.useStaticAssets(join(__dirname, 'assets'));

  return app.listen(port, () => {
    Logger.log(
      'Listening at http://localhost:' + port + '/' + globalPrefix
    );
  });
}

bootstrapStorage();
bootstrapCqrs();
bootstrap();
