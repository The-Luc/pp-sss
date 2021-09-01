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

export const PLAY_IN_STYLES = {
  BLUR: 'blur',
  FADE_IN: 'fadeIn',
  FADE_SCALE: 'fadeAndScale',
  FADE_SLIDE_IN: 'fadeAndSlideIn',
  SLIDE_IN: 'slideIn'
};

export const PLAY_OUT_STYLES = {
  BLUR: 'blur',
  FADE_OUT: 'fadeOut',
  FADE_SCALE: 'fadeAndScale',
  FADE_SLIDE_OUT: 'fadeAndSlideOut',
  SLIDE_OUT: 'slideOut'
};
export const PLAY_IN_OPTIONS = [
  NONE_OPTION,
  {
    name: 'Blur',
    value: PLAY_IN_STYLES.BLUR
  },
  {
    name: 'Fade In',
    value: PLAY_IN_STYLES.FADE_IN
  },
  {
    name: 'Fade and Scale',
    value: PLAY_IN_STYLES.FADE_SCALE,
    showScale: true
  },
  {
    name: 'Fade and Slide In',
    value: PLAY_IN_STYLES.FADE_SLIDE_IN,
    showDirection: true
  },
  {
    name: 'Slide In',
    value: PLAY_IN_STYLES.SLIDE_IN,
    showDirection: true
  }
];

export const PLAY_OUT_OPTIONS = [
  NONE_OPTION,
  {
    name: 'Blur',
    value: PLAY_OUT_STYLES.BLUR
  },
  {
    name: 'Fade Out',
    value: PLAY_OUT_STYLES.FADE_OUT
  },
  {
    name: 'Fade and Scale',
    value: PLAY_OUT_STYLES.FADE_SCALE,
    showScale: true
  },
  {
    name: 'Fade and Slide Out',
    value: PLAY_OUT_STYLES.FADE_SLIDE_OUT,
    showDirection: true
  },
  {
    name: 'Slide Out',
    value: PLAY_OUT_STYLES.SLIDE_OUT,
    showDirection: true
  }
];

export const ANIMATION_DIR = {
  LEFT_RIGHT: 'leftToRight',
  RIGHT_LEFT: 'rightToLeft',
  TOP_BOTTOM: 'topToBottom',
  BOTTOM_TOP: 'bottomToTop'
};

export const DIRECTION_OPTIONS = [
  {
    name: 'Left to Right',
    value: ANIMATION_DIR.LEFT_RIGHT,
    icon: 'east'
  },
  {
    name: 'Right to Left',
    value: ANIMATION_DIR.RIGHT_LEFT,
    icon: 'west'
  },
  {
    name: 'Top to Bottom',
    value: ANIMATION_DIR.TOP_BOTTOM,
    icon: 'south'
  },
  {
    name: 'Bottom to Top',
    value: ANIMATION_DIR.BOTTOM_TOP,
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

export const DELAY_DURATION = 500;
