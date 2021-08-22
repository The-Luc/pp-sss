import { VIDEO_EVENT_TYPE } from '../constants';

export const videoSeekEvent = new CustomEvent(VIDEO_EVENT_TYPE.SEEK, {
  detail: {}
});

export const videoRewindEvent = new CustomEvent(VIDEO_EVENT_TYPE.REWIND, {
  detail: {}
});

export const videoEndRewindEvent = new CustomEvent(
  VIDEO_EVENT_TYPE.END_REWIND,
  { detail: {} }
);

export const videoToggleStatusEvent = new CustomEvent(
  VIDEO_EVENT_TYPE.TOGGLE_STATUS,
  { detail: {} }
);
