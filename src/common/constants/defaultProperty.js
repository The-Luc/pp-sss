import { TEXT_CASE } from './textCase';
import { TEXT_HORIZIONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from './textAlign';
import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from './backgroundType';

export const DEFAULT_PROP = {
  OPACITY: 1,
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
  BORDER: {
    FILL: false,
    STROKE: '#000000'
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
  TYPE: BACKGROUND_TYPE.THEME.id,
  PAGE_TYPE: BACKGROUND_PAGE_TYPE.FULL_PAGE.id
};
