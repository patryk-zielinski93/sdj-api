import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SdjCqrsModule } from '@sdj/backend/cqrs';
import { microservices } from '@sdj/backend/shared/config';

export async function bootstrapCqrs(): Promise<void> {
  const microservice = await NestFactory.createMicroservice(SdjCqrsModule, microservices.cqrs);
  await microservice.listenAsync();
  Logger.log('CQRS Service is listening');
}
