export const PLAYBACK = {
  ALL: 0,
  SCREEN: 1,
  FRAME: 2
};

export const PLAYBACK_DEFAULT_OPTIONS = [
  {
    name: 'Play From Beginning',
    value: PLAYBACK.ALL
  },
  {
    name: 'Play Screen',
    value: PLAYBACK.SCREEN
  }
];

export const PLAYBACK_FRAME_OPTION = {
  name: 'Play Frame ',
  value: PLAYBACK.FRAME,
  frameId: null
};
