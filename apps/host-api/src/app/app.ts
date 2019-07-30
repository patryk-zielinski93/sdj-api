import * as express from 'express';
import * as core from 'express-serve-static-core';
import { router } from './routers/router';

export class App {
  express: core.Express;
  constructor() {
    this.express = express();
  }

  init(): void {
    this.initRoutes();
  }

  initRoutes(): void {
    this.express.use('/', router);
  }

  start(): void {
    const port = process.env.port || 8887;
    const server = this.express.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    this.express.all('*', console.log);
    server.on('error', console.error);
  }
}
