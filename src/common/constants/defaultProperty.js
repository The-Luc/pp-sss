import { TEXT_CASE } from './textCase';
import { TEXT_HORIZONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from './textAlign';
import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from './backgroundType';
import { PRINT_PAGE_SIZE } from './canvas';

export const OBJECT_MIN_SIZE = 0.5; // inch

export const DEFAULT_PROP = {
  OPACITY: 1,
  COLOR: '#000000',
  WIDTH: 1.5,
  HEIGHT: 1.5,
  MIN_POSITION: -100,
  MAX_POSITION: 100,
  MIN_SIZE: 0.5,
  MAX_SIZE: 60
};

export const DEFAULT_COORD = {
  X: PRINT_PAGE_SIZE.PDF_WIDTH * 0.5, // center
  Y: PRINT_PAGE_SIZE.PDF_HEIGHT * 0.5, // middle
  ROTATION: 0
};

export const DEFAULT_SHADOW = {
  DROP_SHADOW: false,
  BLUR: 5,
  OFFSET: 2,
  OPACITY: 0.5,
  ANGLE: 270,
  COLOR: DEFAULT_PROP.COLOR
};

export const DEFAULT_TEXT = {
  TEXT: 'Text',
  COORD: {
    ...DEFAULT_COORD
  },
  SIZE: {
    width: 0,
    height: 0
  },
  TEXT_CASE: TEXT_CASE.NONE,
  STYLE_ID: 'default',
  FONT_FAMILY: 'Arial',
  FONT_SIZE: 60,
  IS_BOLD: false,
  IS_ITALIC: false,
  IS_UNDERLINE: false,
  ALIGNMENT: {
    HORIZONTAL: TEXT_HORIZONTAL_ALIGN.LEFT,
    VERTICAL: TEXT_VERTICAL_ALIGN.TOP
  },
  LETTER_SPACING: 0,
  LINE_SPACING: 0,
  LINE_HEIGHT: 1,
  COLUMN: 1,
  ORIGIN: {
    X: 0,
    Y: 0
  },
  LOCK_UNI_SCALE: false,
  OPACITY: DEFAULT_PROP.OPACITY,
  EDITING_BORDER_COLOR: 'transparent',
  BORDER: {
    FILL: false,
    STROKE: DEFAULT_PROP.COLOR,
    STROKE_WIDTH: 0,
    STROKE_DASH_ARRAY: [],
    STROKE_LINE_CAP: 'solid'
  },
  SHADOW: {
    ...DEFAULT_SHADOW
  },
  IS_CONSTRAIN: false,
  MIN_SIZE: DEFAULT_PROP.MIN_SIZE,
  MAX_SIZE: DEFAULT_PROP.MAX_SIZE,
  MIN_POSITION: DEFAULT_PROP.MIN_POSITION,
  MAX_POSITION: DEFAULT_PROP.MAX_POSITION
};

export const DEFAULT_CLIP_ART = {
  COORD: {
    ...DEFAULT_COORD
  },
  COLOR: DEFAULT_PROP.COLOR,
  ORIGIN: {
    X: 0,
    Y: 0
  },
  OPACITY: DEFAULT_PROP.OPACITY,
  WIDTH: 3, // inch
  HEIGHT: 3, // inch
  MIN_SIZE: DEFAULT_PROP.MIN_SIZE,
  MAX_SIZE: DEFAULT_PROP.MAX_SIZE,
  IS_CONSTRAIN: true,
  MIN_POSITION: DEFAULT_PROP.MIN_POSITION,
  MAX_POSITION: DEFAULT_PROP.MAX_POSITION,
  SHADOW: {
    ...DEFAULT_SHADOW
  }
};

export const DEFAULT_IMAGE = {
  category: 'Cover',
  name: '',
  thumbnail:
    'https://willis.fluidmedia.cloud/images/yearbook_builder/content_placeholder.jpg',
  imageUrl:
    'https://willis.fluidmedia.cloud/images/yearbook_builder/content_placeholder.jpg'
};

export const DEFAULT_BACKGROUND = {
  BACKGROUND_TYPE: BACKGROUND_TYPE.THEME.id,
  PAGE_TYPE: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
  IS_LEFT: true
};

export const DEFAULT_SHAPE = {
  WIDTH: DEFAULT_PROP.WIDTH,
  HEIGHT: DEFAULT_PROP.HEIGHT,
  MIN_SIZE: DEFAULT_PROP.MIN_SIZE,
  MAX_SIZE: DEFAULT_PROP.MAX_SIZE,
  MIN_POSITION: DEFAULT_PROP.MIN_POSITION,
  MAX_POSITION: DEFAULT_PROP.MAX_POSITION,
  SHADOW: {
    ...DEFAULT_SHADOW
  }
};
