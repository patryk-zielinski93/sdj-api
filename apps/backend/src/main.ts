import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { NestFactory } from '@nestjs/core';
import { connectionConfig } from '@sdj/backend/config';
import { WebSocketModule } from '@sdj/backend/websocket';
import * as cors from 'cors';
import { AppModule } from './app/app.module';


async function bootstrapWebSocket() {
  const microservice = await NestFactory.createMicroservice(WebSocketModule, connectionConfig.microservices);
  microservice.listen(() => Logger.log('WebSocket is listening'));
}
async function bootstrap(): Promise<void> {
  bootstrapWebSocket();

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(connectionConfig.microservices);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 8888;
  app.use(cors());
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
