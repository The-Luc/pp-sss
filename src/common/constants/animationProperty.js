export const PLAYBACK_OPTIONS = [
  {
    name: 'Play in Template',
    value: 'playInTemplate'
  }
];

export const NONE_OPTION = {
  name: 'None',
  value: 'none'
};

export const REPEAT_OPTIONS = [NONE_OPTION];

export const PLAY_IN_OUT_OPTIONS = [
  NONE_OPTION,
  {
    name: 'Fade and Scale',
    value: 'fadeAndScale'
  }
];

export const PLAY_IN_OPTIONS = [
  NONE_OPTION,
  {
    name: 'Blur',
    value: 'blur'
  },
  {
    name: 'Fade In',
    value: 'fadeIn'
  },
  {
    name: 'Fade and Scale',
    value: 'fadeAndScale',
    showScale: true
  },
  {
    name: 'Fade and Slide In',
    value: 'fadeAndSlideIn',
    showDirection: true
  },
  {
    name: 'Slide In',
    value: 'slideIn',
    showDirection: true
  }
];

export const PLAY_OUT_OPTIONS = [
  NONE_OPTION,
  {
    name: 'Fade Out',
    value: 'fadeOut'
  },
  {
    name: 'Fade and Scale',
    value: 'fadeAndScale',
    showScale: true
  },
  {
    name: 'Fade and Slide Out',
    value: 'fadeAndSlideOut',
    showDirection: true
  },
  {
    name: 'Slide Out',
    value: 'slideOut',
    showDirection: true
  }
];

export const DIRECTION_OPTIONS = [
  {
    name: 'Left to Right',
    value: 'leftToRight',
    icon: 'east'
  },
  {
    name: 'Right to Left',
    value: 'rightToLeft',
    icon: 'west'
  },
  {
    name: 'Top to Bottom',
    value: 'topToBottom',
    icon: 'south'
  },
  {
    name: 'Bottom to Top',
    value: 'bottomToTop',
    icon: 'north'
  }
];

export const VIDEO_ORDER = [
  {
    name: '1',
    value: '1'
  },
  {
    name: '2',
    value: '2'
  }
];

export const CONTROL_TYPE = {
  PLAY_IN: 'playIn',
  PLAY_OUT: 'playOut'
};
