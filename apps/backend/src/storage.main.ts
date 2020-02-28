import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { microservices } from '@sdj/backend/shared/config';
import { StorageModule } from '@sdj/backend/storage';

export async function bootstrapStorage(): Promise<void> {
  const microservice = await NestFactory.createMicroservice(StorageModule, microservices.storage);
  await microservice.listenAsync();
  Logger.log('Storage Service is listening');
}
