import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@sdj/backend/core';
import { PlayDjHandler } from './cqrs/command-bus/handlers/play-dj.handler';
import { PlayRadioHandler } from './cqrs/command-bus/handlers/play-radio.handler';
import { Gateway } from './gateway';
import { WebSocketController } from './controllers/websocket.controller';

export const CommandHandlers = [];
export const EventHandlers = [] //[PlayDjHandler, PlayRadioHandler];

@Module({
  imports: [
    // CoreModule,
    // TypeOrmModule.forRoot({
    //   type: "mysql",
    //   host: "database",
    //   port: 3306,
    //   username: "sdj",
    //   password: "sdj123123",
    //   database: "slack_dj",
    //   synchronize: true,
    //   logging: false,
    //   entities: [
    //     "libs/backend/db/src/lib/entities/**/*.ts"
    //   ],
    //   migrations: [
    //     "libs/backend/db/src/lib/migrations/**/*.ts"
    //   ],
    //   subscribers: [
    //     "libs/backend/db/src/lib/**/*.ts"
    //   ],
    //   cli: {
    //     entitiesDir: "libs/backend/db/src/lib/entities",
    //     migrationsDir: "libs/backend/db/src/lib/migrations",
    //     subscribersDir: "libs/backend/db/src/lib/subscribers"
    //   }
    // }
    // ),
  ],
  controllers: [WebSocketController],
  providers: [...CommandHandlers, ...EventHandlers, Gateway],
  exports: [Gateway]
})
export class WebSocketModule {
}
