import { MockEventEmitter } from './mock-event-emitter';

let socket: MockEventEmitter;

export function assignSocket(assign: MockEventEmitter): void {
  socket = assign;
}

export function emmitInWs(event, data?): void {
  socket.emit(event, data);
}
