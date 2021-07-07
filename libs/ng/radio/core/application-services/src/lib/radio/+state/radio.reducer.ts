import { Action } from '@ngrx/store';
import { SourceType } from '@sdj/ng/radio/core/domain';
import { JoinCommand } from '../commands/join/join.command';
import { AudioSourceChangedEvent } from '../events/audio-source-changed/audio-source-changed.event';
import { RoomIsRunningEvent } from '../events/room-is-running.event';

export const RADIO_FEATURE_KEY = 'radio';

export interface RadioState {
  roomIsRunning: boolean;
  audioSource: string | null;
  sourceType: SourceType | null;
}

export interface RadioPartialState {
  readonly [RADIO_FEATURE_KEY]: RadioState;
}

export const initialState: RadioState = {
  roomIsRunning: false,
  audioSource: null,
  sourceType: null,
};

export function reducer(
  state: RadioState = initialState,
  action: Action
): RadioState {
  switch (action.type) {
    case AudioSourceChangedEvent.type:
      state = {
        ...state,
        audioSource: (<AudioSourceChangedEvent>action).payload.src,
        sourceType: (<AudioSourceChangedEvent>action).payload.sourceType,
      };
      break;
    case JoinCommand.type:
      state = { ...state, roomIsRunning: false };
      break;
    case RoomIsRunningEvent.type:
      state = { ...state, roomIsRunning: true };
  }
  return state;
}
