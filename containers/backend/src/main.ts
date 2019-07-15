import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import 'reflect-metadata';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());

  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'public'));
  app.setViewEngine(<any>{
    engine: {
      handlebars: require('handlebars')
    },
    templates: join(__dirname, 'public')
  });
  await app.listen(8888);
}

bootstrap();
