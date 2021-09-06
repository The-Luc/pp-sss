export const CLASS_ROLE = {
  STUDENT: 'STUDENT',
  PRIMARY_TEACHER: 'PRIMARY_TEACHER',
  ASSISTANT_TEACHER: 'ASSISTANT_TEACHER'
};

export const PORTRAIT_TEACHER_PLACEMENT = {
  FIRST: 'FIRST',
  LAST: 'LAST',
  ALPHABETICAL: 'ALPHABETICAL'
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
    name: 'Automatically ...'
  },
  MANUAL: {
    id: 1,
    name: 'Ask me ...'
  }
};

export const PORTRAIT_FLOW_OPTION_MULTI = {
  AUTO: {
    id: 0,
    name: 'Automatically ...'
  },
  MANUAL: {
    id: 1,
    name: 'Ask me ...'
  },
  CONTINUE: {
    id: 2,
    name: 'Flow ...'
  }
};

export const DEFAUL_PORTRAIT = {
  ROW_COUNT: 5,
  COLUMN_COUNT: 5
};

export const DEFAULT_PORTRAIT_RATIO = 1.25; // height / width ratio
