import { MockEventEmitter } from './mock-event-emitter';

let socket: MockEventEmitter;

export function assignSocket(assign: MockEventEmitter): void {
  socket = assign;
}

Cypress.Commands.add('emmitInWs', (event, data?): void => {
  socket.emit(event, data);
});
