import color from 'color';

import { TEXT_CASE } from './textCase';
import { TEXT_HORIZONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from './textAlign';
import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from './backgroundType';
import { PRINT_PAGE_SIZE } from './canvas';
import { IMAGE_LOCAL } from './image';
import { SVG_FILL_MODE } from './svgFillMode';
import { POSITION_ORIGIN } from './origin';

export const OBJECT_MIN_SIZE = 0.5; // inch

export const DEFAULT_SVG = {
  WIDTH: 1.5,
  HEIGHT: 1.5
};

export const DEFAULT_BORDER = {
  SHOW_BORDER: false,
  STROKE: '#000000',
  STROKE_WIDTH: 0,
  STROKE_DASH_ARRAY: [],
  STROKE_LINE_TYPE: 'solid'
};

export const DEFAULT_COLOR = {
  ALPHA: 0.5,
  COLOR: '#000000',
  DISABLED_COLOR: '#ffffff'
};

export const DEFAULT_PROP = {
  OPACITY: 1,
  COLOR: DEFAULT_COLOR.COLOR,
  MIN_POSITION: -Infinity,
  MAX_POSITION: Infinity,
  MIN_SIZE: 0.5,
  MAX_SIZE: 60,
  BORDER: { ...DEFAULT_BORDER },
  IS_CONSTRAIN: true,
  COLOR_WITH_ALPHA: color(DEFAULT_COLOR.COLOR)
    .alpha(DEFAULT_COLOR.ALPHA)
    .toString()
};

export const DEFAULT_COORD = {
  X: PRINT_PAGE_SIZE.PDF_WIDTH * 0.5, // center
  Y: PRINT_PAGE_SIZE.PDF_HEIGHT * 0.5, // middle
  ROTATION: 0
};

export const DEFAULT_ORIGIN = {
  X: POSITION_ORIGIN.LEFT,
  Y: POSITION_ORIGIN.TOP
};

export const DEFAULT_SHADOW = {
  DROP_SHADOW: false,
  BLUR: 5,
  OFFSET: 2,
  OPACITY: 0.5,
  ANGLE: 270,
  COLOR: DEFAULT_PROP.COLOR_WITH_ALPHA
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
  COLOR: DEFAULT_PROP.COLOR,
  IS_BOLD: false,
  IS_ITALIC: false,
  IS_UNDERLINE: false,
  ALIGNMENT: {
    HORIZONTAL: TEXT_HORIZONTAL_ALIGN.LEFT,
    VERTICAL: TEXT_VERTICAL_ALIGN.TOP
  },
  LETTER_SPACING: 0,
  CHAR_SPACING: 0,
  LINE_SPACING: 0,
  LINE_HEIGHT: 1.2,
  COLUMN: 1,
  PADDING: 0.1,
  ORIGIN: {
    ...DEFAULT_ORIGIN
  },
  LOCK_UNI_SCALE: false,
  OPACITY: DEFAULT_PROP.OPACITY,
  EDITING_BORDER_COLOR: 'transparent',
  BORDER: { ...DEFAULT_BORDER },
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
    ...DEFAULT_ORIGIN
  },
  OPACITY: DEFAULT_PROP.OPACITY,
  WIDTH: DEFAULT_SVG.WIDTH, // inch
  HEIGHT: DEFAULT_SVG.HEIGHT, // inch
  MIN_SIZE: DEFAULT_PROP.MIN_SIZE,
  MAX_SIZE: DEFAULT_PROP.MAX_SIZE,
  FILL_MODE: SVG_FILL_MODE.FILL,
  IS_CONSTRAIN: DEFAULT_PROP.IS_CONSTRAIN,
  MIN_POSITION: DEFAULT_PROP.MIN_POSITION,
  MAX_POSITION: DEFAULT_PROP.MAX_POSITION,
  SHADOW: {
    ...DEFAULT_SHADOW
  }
};

const BASE_MEDIA = {
  CATEGORY: 'Cover',
  STYLE_ID: 1,
  NAME: '',
  THUMBNAIL: IMAGE_LOCAL.PLACE_HOLDER,
  MIN_SIZE: DEFAULT_PROP.MIN_SIZE,
  MAX_SIZE: DEFAULT_PROP.MAX_SIZE,
  MIN_POSITION: DEFAULT_PROP.MIN_POSITION,
  MAX_POSITION: DEFAULT_PROP.MAX_POSITION,
  IS_CONSTRAIN: DEFAULT_PROP.IS_CONSTRAIN,
  IMAGE_URL: IMAGE_LOCAL.PLACE_HOLDER,
  STROKE_UNIFORM: true,
  PAINT_FIRST: 'stroke'
};

export const DEFAULT_IMAGE = {
  ...BASE_MEDIA
};

export const DEFAULT_VIDEO = {
  ...BASE_MEDIA
};

export const DEFAULT_BACKGROUND = {
  BACKGROUND_TYPE: BACKGROUND_TYPE.THEME.id,
  PAGE_TYPE: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
  IS_LEFT: true
};

export const DEFAULT_SHAPE = {
  WIDTH: DEFAULT_SVG.WIDTH,
  HEIGHT: DEFAULT_SVG.HEIGHT,
  MIN_SIZE: DEFAULT_PROP.MIN_SIZE,
  MAX_SIZE: DEFAULT_PROP.MAX_SIZE,
  MIN_POSITION: DEFAULT_PROP.MIN_POSITION,
  MAX_POSITION: DEFAULT_PROP.MAX_POSITION,
  SHADOW: {
    ...DEFAULT_SHADOW
  },
  ORIGIN: {
    ...DEFAULT_ORIGIN
  },
  FILL_MODE: SVG_FILL_MODE.FILL,
  BORDER: { ...DEFAULT_BORDER }
};
