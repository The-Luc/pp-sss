import { TEXT_CASE } from './textCase';
import { TEXT_HORIZIONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from './textAlign';
import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from './backgroundType';

export const DEFAULT_PROP = {
  OPACITY: 1,
  COLOR: '#000000'
};

export const DEFAULT_SHADOW = {
  DROP_SHADOW: false,
  BLUR: 5,
  OFFSET: 2,
  OPACITY: 0.5,
  ANGLE: 270,
  COLOR: '#000000'
};

export const DEFAULT_TEXT = {
  TEXT: 'Text',
  COORD: {
    X: 51,
    Y: 282,
    ROTATION: 0
  },
  TEXT_CASE: TEXT_CASE.NONE,
  STYLE_ID: 'default',
  FONT_FAMILY: 'Arial',
  FONT_SIZE: 60,
  IS_BOLD: false,
  IS_ITALIC: false,
  IS_UNDERLINE: false,
  ALIGNMENT: {
    HORIZIONTAL: TEXT_HORIZIONTAL_ALIGN.LEFT,
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
  OPACITY: 1,
  EDITING_BORDER_COLOR: 'transparent',
  BORDER: {
    FILL: false,
    STROKE: '#000000',
    STROKE_WIDTH: 0,
    STROKE_DASH_ARRAY: [],
    STROKE_LINE_CAP: 'solid'
  },
  SHADOW: {
    ...DEFAULT_SHADOW
  }
};

export const DEFAULT_CLIP_ART = {
  COORD: {
    X: 51,
    Y: 282,
    ROTATION: 0
  },
  COLOR: '#000000',
  ORIGIN: {
    X: 0,
    Y: 0
  },
  OPACITY: 1
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
  TYPE: BACKGROUND_TYPE.THEME.id,
  PAGE_TYPE: BACKGROUND_PAGE_TYPE.FULL_PAGE.id
};

export const DEFAULT_SHAPE = {
  WIDTH: 20,
  HEIGHT: 20
};
