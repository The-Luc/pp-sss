import {
  TEXT_CASE,
  TEXT_HORIZONTAL_ALIGN,
  TEXT_VERTICAL_ALIGN,
  DEFAULT_COLOR
} from './index';

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
    value: 0,
    name: 'First Last'
  },
  LAST_FIRST: {
    value: 1,
    name: 'Last, First'
  }
};

export const PORTRAIT_NAME_POSITION = {
  CENTERED: {
    value: 0,
    name: 'Centered Last'
  },
  OUTSIDE: {
    value: 1,
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

export const DEFAULT_PORTRAIT_RATIO = 1.25; // height / width ratio

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

export const TEXT_MARGIN_OPTION = [
  { name: '0.45"', value: 0.45 },
  { name: '0.5"', value: 0.5 },
  { name: '0.75"', value: 0.75 },
  { name: '1" ', value: 1 },
  { name: '1.5"', value: 1.5 },
  { name: '2"', value: 2 },
  { name: '2.5"', value: 2.5 },
  { name: '3"', value: 3 },
  { name: '4"', value: 4 }
];

export const TEXT_POSITION_OPTION = [
  { name: 'Centered', value: 0 },
  { name: 'Outside', value: 1 }
];

export const TEXT_DISPLAY_OPTION = [
  { name: 'First Last', value: 0 },
  { name: 'Last, First', value: 1 }
];

export const NAME_WIDTH_OPTION = [
  { name: '1.5"', value: 1.5 },
  { name: '1.75"', value: 1.75 },
  { name: '2"', value: 2 },
  { name: '2.25"', value: 2.25 },
  { name: '2.5"', value: 2.5 },
  { name: '2.75"', value: 2.75 },
  { name: '3"', value: 3 }
];

export const NAME_GAP_OPTION = [
  { name: '0.25"', value: 0.25 },
  { name: '0.5"', value: 0.5 },
  { name: '0.75"', value: 0.75 },
  { name: '1"', value: 1 }
];

export const NAME_LINES_OPTION = [
  { name: '1', value: 1 },
  { name: '2', value: 2 }
];

export const STATUS_PAGE_TITLE = [
  { name: 'Off', value: false },
  { name: 'On', value: true }
];

export const DEFAULT_MARGIN_PAGE_TITLE = {
  top: 0.45,
  left: 0.5,
  right: 0.5,
  bottom: 0.25
};

export const MIN_MAX_TEXT_SETTINGS = {
  MIN_MARGIN: 0.45,
  MAX_MARGIN: 4,
  MIN_BOTTOM_MARGIN: 0.25,
  MIN_LINES: 1,
  MAX_LINES: 2,
  MIN_WIDTH: 1.25,
  MAX_WIDTH: 3,
  MIN_GAP: 0.125,
  MAX_GAP: 1
};

export const DEFAULT_TEXT_PROPERTIES = {
  fontFamily: 'Open Sans',
  fontColor: DEFAULT_COLOR.COLOR,
  isBold: true,
  isItalic: false,
  isUnderline: false,
  textCase: TEXT_CASE.NONE,
  alignment: {
    horizontal: TEXT_HORIZONTAL_ALIGN.CENTER,
    vertical: TEXT_VERTICAL_ALIGN.TOP
  }
};

export const DEFAULT_PAGE_TITLE = {
  ...DEFAULT_TEXT_PROPERTIES,
  fontSize: 20
};

export const DEFAULT_NAME_TEXT = {
  ...DEFAULT_TEXT_PROPERTIES,
  fontSize: 8
};
