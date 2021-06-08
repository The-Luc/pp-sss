import { TEXT_CASE } from './textCase';
import { TEXT_HORIZIONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from './textAlign';

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
  COLOR: '#000000',
  ALIGNMENT: {
    HORIZIONTAL: TEXT_HORIZIONTAL_ALIGN.LEFT,
    VERTICAL: TEXT_VERTICAL_ALIGN.TOP
  },
  LETTER_SPACING: 0,
  LINE_SPACING: 'auto',
  COLUMN: 1,
  ORIGIN: {
    X: 0,
    Y: 0
  },
  LOCK_UNI_SCALE: false,
  OPACITY: 1
};
