export const PLAYBACK_OPTIONS = [
  {
    name: 'Play in Template',
    value: 0
  }
];

export const NONE_OPTION = {
  name: 'None',
  value: 0
};

export const REPEAT_OPTIONS = [NONE_OPTION];

export const PLAY_IN_OUT_OPTIONS = [
  NONE_OPTION,
  {
    name: 'Fade and Scale',
    value: 0
  }
];

export const PLAY_IN_STYLES = {
  BLUR: 1,
  FADE_IN: 2,
  FADE_SCALE: 3,
  FADE_SLIDE_IN: 4,
  SLIDE_IN: 5
};

export const PLAY_OUT_STYLES = {
  BLUR: 1,
  FADE_OUT: 2,
  FADE_SCALE: 3,
  FADE_SLIDE_OUT: 4,
  SLIDE_OUT: 5
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
  LEFT_RIGHT: 0,
  RIGHT_LEFT: 1,
  TOP_BOTTOM: 2,
  BOTTOM_TOP: 3
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
    value: 1
  },
  {
    name: '2',
    value: 2
  }
];

export const APPLY_MODE = {
  SELF: 'self',
  FRAME: 'frame',
  SECTION: 'section',
  BOOK: 'book'
};

export const TEXT_APPLY_OPTIONS = [
  {
    name: 'This text only',
    value: APPLY_MODE.SELF
  },
  {
    name: 'All text on the frame',
    value: APPLY_MODE.FRAME
  },
  {
    name: 'All text in this section',
    value: APPLY_MODE.SECTION
  },
  {
    name: 'All text in the Digital Yearbook',
    value: APPLY_MODE.BOOK
  }
];

export const IMAGE_APPLY_OPTIONS = [
  {
    name: 'This image only',
    value: APPLY_MODE.SELF
  },
  {
    name: 'All images on the frame',
    value: APPLY_MODE.FRAME
  },
  {
    name: 'All images in this section',
    value: APPLY_MODE.SECTION
  },
  {
    name: 'All images in the Digital Yearbook',
    value: APPLY_MODE.BOOK
  }
];

export const SHAPE_APPLY_OPTIONS = [
  {
    name: 'This shape only',
    value: APPLY_MODE.SELF
  },
  {
    name: 'All shapes on the frame',
    value: APPLY_MODE.FRAME
  },
  {
    name: 'All shapes in this section',
    value: APPLY_MODE.SECTION
  },
  {
    name: 'All shapes in the Digital Yearbook',
    value: APPLY_MODE.BOOK
  }
];

export const CLIP_ART_APPLY_OPTIONS = [
  {
    name: 'This clip art only',
    value: APPLY_MODE.SELF
  },
  {
    name: 'All clip arts on the frame',
    value: APPLY_MODE.FRAME
  },
  {
    name: 'All clip arts in this section',
    value: APPLY_MODE.SECTION
  },
  {
    name: 'All clip arts in the Digital Yearbook',
    value: APPLY_MODE.BOOK
  }
];

export const BACKGROUND_APPLY_OPTIONS = [
  {
    name: 'This background only',
    value: APPLY_MODE.SELF
  },
  {
    name: 'All backgrounds in this section',
    value: APPLY_MODE.SECTION
  },
  {
    name: 'All backgrounds in the Digital Yearbook',
    value: APPLY_MODE.BOOK
  }
];

export const CONTROL_TYPE = {
  PLAY_IN: 'playIn',
  PLAY_OUT: 'playOut'
};

export const DELAY_DURATION = 500;
export const BLUR_DELAY_DURATION = 1000;

export const DEFAULT_ANIMATION = {
  STYLE: NONE_OPTION,
  DIRECTION: '',
  DURATION: 0.8,
  SCALE: 50,
  ORDER: 1
};
