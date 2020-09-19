import { SourceType } from '@sdj/ng/radio/core/domain';

export interface AudioSourceChangedEventPayload {
  src: string;
  sourceType: SourceType;
}
