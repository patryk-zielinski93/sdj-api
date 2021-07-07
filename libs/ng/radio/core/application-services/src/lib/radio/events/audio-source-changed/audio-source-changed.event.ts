import { Action } from '@ngrx/store';
import { AudioSourceChangedEventPayload } from './audio-source-changed.event-payload';

export class AudioSourceChangedEvent implements Action {
  static type = '[Radio] Audio Source Changed';
  type = AudioSourceChangedEvent.type;

  constructor(public payload: AudioSourceChangedEventPayload) {}
}
