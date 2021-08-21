import { VIDEO_EVENT_TYPE } from '../constants';

export const videoSeekEvent = new CustomEvent(VIDEO_EVENT_TYPE.SEEK, {
  detail: {}
});
