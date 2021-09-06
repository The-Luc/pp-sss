export const TRANSITION = {
  NONE: 0,
  PUSH: 1,
  MOVE_IN: 2,
  DISSOLVE: 3,
  REVEAL: 4,
  WIPE: 5
};

export const TRANSITION_OPTIONS = [
  {
    name: 'None',
    value: TRANSITION.NONE
  },
  {
    name: 'Push',
    value: TRANSITION.PUSH
  },
  {
    name: 'Move In',
    value: TRANSITION.MOVE_IN
  },
  {
    name: 'Dissolve',
    value: TRANSITION.DISSOLVE
  },
  {
    name: 'Reveal',
    value: TRANSITION.REVEAL
  },
  {
    name: 'Wipe',
    value: TRANSITION.WIPE
  }
];

export const TRANSITION_DEFAULT = TRANSITION_OPTIONS[1];

export const TRANS_DIRECTION = {
  LEFT_RIGTH: 0,
  RIGHT_LEFT: 1,
  TOP_BOTTOM: 2,
  BOTTOM_TOP: 3
};

export const TRANS_DIRECTION_OPTIONS = [
  {
    name: 'Left to Right',
    value: TRANS_DIRECTION.LEFT_RIGTH
  },
  {
    name: 'Right to Left',
    value: TRANS_DIRECTION.RIGHT_LEFT
  },
  {
    name: 'Top to Bottom',
    value: TRANS_DIRECTION.TOP_BOTTOM
  },
  {
    name: 'Bottom to Top',
    value: TRANS_DIRECTION.BOTTOM_TOP
  }
];

export const TRANS_DIRECTION_DEFAULT = TRANS_DIRECTION_OPTIONS[2];

export const TRANS_DURATION_RANGE = { MIN: 0, MAX: 5 };

export const TRANS_DURATION_DEFAULT = 0.8;

export const TRANS_TARGET = {
  NONE: 0,
  SELF: 1,
  CURRENT_SHEET: 2,
  CURRENT_SECTION: 3,
  ALL: 4
};

export const TRANS_TARGET_OPTIONS = [
  {
    name: 'Apply To…',
    value: TRANS_TARGET.NONE
  },
  {
    name: 'This transition only',
    value: TRANS_TARGET.SELF
  },
  {
    name: 'All transitions in this screen',
    value: TRANS_TARGET.CURRENT_SHEET
  },
  {
    name: 'All transitions in this section',
    value: TRANS_TARGET.CURRENT_SECTION
  },
  {
    name: 'All transitions in the Digital Yearbook',
    value: TRANS_TARGET.ALL
  }
];

export const TRANS_TARGET_DEFAULT = TRANS_TARGET_OPTIONS[0];
