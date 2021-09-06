import {
  PORTRAIT_ASSISTANT_PLACEMENT,
  PORTRAIT_SIZE,
  PORTRAIT_TEACHER_PLACEMENT
} from './portrait';

export const PORTRAIT_COL_ROW_RANGE = {
  MIN: 1,
  MAX: 8
};

export const PORTRAIT_MARGIN_OPTIONS = [
  { name: '0.5"', value: 0.5 },
  { name: '1" ', value: 1 },
  { name: '1.5"', value: 1.5 },
  { name: '2"', value: 2 },
  { name: '2.5"', value: 2.5 },
  { name: '3"', value: 3 },
  { name: '3.5"', value: 3.5 },
  { name: '4"', value: 4 },
  { name: '4.5"', value: 4.5 },
  { name: '5"', value: 5 }
];

export const YES_NO_OPTIONS = [
  {
    name: 'Yes',
    value: true
  },
  {
    name: 'No',
    value: false
  }
];

export const TEACHER_PLACEMENT_OPTIONS = [
  {
    name: 'First',
    value: PORTRAIT_TEACHER_PLACEMENT.FIRST
  },
  {
    name: 'Last',
    value: PORTRAIT_TEACHER_PLACEMENT.LAST
  },
  {
    name: 'Alphabetical',
    value: PORTRAIT_TEACHER_PLACEMENT.ALPHABETICAL
  }
];

export const ASSISTANT_PLACEMENT_OPTIONS = [
  {
    name: 'After Teacher(s)',
    value: PORTRAIT_ASSISTANT_PLACEMENT.AFTER_TEACHERS
  },
  {
    name: 'Before Teacher(s)',
    value: PORTRAIT_ASSISTANT_PLACEMENT.BEFORE_TEACHERS
  }
];

export const PORTRAIT_SIZE_OPTIONS = [
  {
    name: 'Large',
    value: PORTRAIT_SIZE.LARGE
  },
  {
    name: 'Same',
    value: PORTRAIT_SIZE.SAME
  }
];
