import { ANIMATION_DIR, DIRECTION_OPTIONS } from './animationProperty';

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

export const TRANS_DIRECTION = ANIMATION_DIR;

export const TRANS_DIRECTION_OPTIONS = DIRECTION_OPTIONS;

export const TRANS_DIRECTION_DEFAULT = TRANS_DIRECTION_OPTIONS[2];

export const TRANS_DURATION_RANGE = { MIN: 0, MAX: 5 };

export const TRANS_DURATION_DEFAULT = 0.8;

export const TRANS_TARGET = {
  NONE: 0,
  SELF: 1,
  SHEET: 2,
  SECTION: 3,
  ALL: 4
};

export const TRANS_TARGET_OPTIONS = [
  {
    name: 'This transition only',
    value: TRANS_TARGET.SELF
  },
  {
    name: 'All transitions in this screen',
    value: TRANS_TARGET.SHEET
  },
  {
    name: 'All transitions in this section',
    value: TRANS_TARGET.SECTION
  },
  {
    name: 'All transitions in the Digital Yearbook',
    value: TRANS_TARGET.ALL
  }
];

export const TRANS_TARGET_DEFAULT = {
  name: 'Apply To…',
  value: TRANS_TARGET.NONE
};
