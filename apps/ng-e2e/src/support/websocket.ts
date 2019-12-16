import { Server } from 'mock-socket';
import { mockConfig } from './configs';

let server: Server;

export const setupMockWSServer = () => {
  server = new Server(mockConfig.backendUrl);
};

export const closeWSServer = () => {
  if (server) {
    server.close();
  }
};
