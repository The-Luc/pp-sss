export const CLASS_ROLE = {
  STUDENT: 'STUDENT',
  PRIMARY_TEACHER: 'PRIMARY_TEACHER',
  ASSISTANT_TEACHER: 'ASSISTANT_TEACHER'
};

export const PORTRAIT_TEACHER_PLACEMENT = {
  FIRST: 'FIRST',
  LAST: 'LAST',
  ALPHABETIAL: 'ALPHABETIAL'
};

export const PORTRAIT_SIZE = {
  SAME: 'SAME',
  LARGE: 'LARGE'
};

export const PORTRAIT_ASSISTANT_PLACEMENT = {
  BEFORE_TEACHERS: 'BEFORE_TEACHERS',
  AFTER_TEACHERS: 'AFTER_TEACHERS'
};

export const PORTRAIT_NAME_DISPLAY = {
  FIRST_LAST: {
    id: 0,
    name: 'First Last'
  },
  LAST_FIRST: {
    id: 1,
    name: 'Last, First'
  }
};

export const PORTRAIT_NAME_POSITION = {
  CENTERED: {
    id: 0,
    name: 'Centered Last'
  },
  OUTSIDE: {
    id: 1,
    name: 'Outside'
  }
};

export const PORTRAIT_IMAGE_MASK = {
  NONE: 0,
  ROUNDED: 1,
  OVAL: 2,
  CIRCLE: 3,
  SQUARE: 4
};

export const PORTRAIT_FLOW_OPTION_SINGLE = {
  AUTO: {
    id: 0,
    name: 'Automatically flow on subsequent page(s)'
  },
  MANUAL: {
    id: 1,
    name: 'Allow me to designate the next page'
  }
};

export const PORTRAIT_FLOW_OPTION_MULTI = {
  AUTO: {
    id: 0,
    name: 'Automatically flow on next page'
  },
  CONTINUE: {
    id: 1,
    name: 'Flow continuously without a break'
  },
  MANUAL: {
    id: 2,
    name: 'Allow me to designate the next page'
  }
};

export const DEFAUL_PORTRAIT = {
  ROW_COUNT: 5,
  COLUMN_COUNT: 5
};

export const DEFAULT_PORTRAIT_RATIO = 1.25; // width / height ratio

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
