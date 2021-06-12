import {
  OBJECT_TYPE,
  DEFAULT_TEXT,
  DEFAULT_IMAGE,
  BACKGROUND_TYPE,
  BACKGROUND_PAGE_TYPE
} from '@/common/constants';

export const BaseProperty = {
  color: '',
  opacity: 1,
  border: {
    type: 0, // TODO: Define constants 0: No Border, 1: Line
    color: '',
    width: 0,
    style: ''
  },
  shadow: {
    enabled: false,
    color: '',
    offset: 0,
    opacity: 0,
    angle: 0,
    blur: 0
  },
  flip: {
    horiziontal: false,
    vertical: false
  }
};

export const BasePrintProperty = {
  ...BaseProperty
};

export const BaseDigitalProperty = {
  ...BaseProperty
};

export const BaseElement = {
  id: '',
  type: '',
  size: {
    width: 0,
    height: 0
  },
  coord: {
    x: 0,
    y: 0,
    rotation: 0 // degree
  }
};

export const TextElement = {
  ...BaseElement,
  type: OBJECT_TYPE.TEXT,
  coord: {
    x: DEFAULT_TEXT.COORD.X,
    y: DEFAULT_TEXT.COORD.Y,
    rotation: DEFAULT_TEXT.COORD.ROTATION // degree
  },
  property: {
    ...BasePrintProperty,
    styleId: DEFAULT_TEXT.STYLE_ID,
    text: DEFAULT_TEXT.TEXT,
    fontFamily: DEFAULT_TEXT.FONT_FAMILY,
    fontSize: DEFAULT_TEXT.FONT_SIZE,
    isBold: DEFAULT_TEXT.IS_BOLD,
    isItalic: DEFAULT_TEXT.IS_ITALIC,
    isUnderline: DEFAULT_TEXT.IS_UNDERLINE,
    color: DEFAULT_TEXT.COLOR,
    textCase: DEFAULT_TEXT.TEXT_CASE, // UPPERCASE, LOWERCASE, CAPITALIZE
    alignment: {
      horiziontal: DEFAULT_TEXT.ALIGNMENT.HORIZIONTAL, // LEFT, CENTER, RIGHT, JUSTIFY
      vertical: DEFAULT_TEXT.ALIGNMENT.VERTICAL // TOP, MIDDLE, BOTTOM
    },
    letterSpacing: DEFAULT_TEXT.LETTER_SPACING,
    lineSpacing: DEFAULT_TEXT.LINE_SPACING, // 1.2 * em
    lineHeight: DEFAULT_TEXT.LINE_HEIGHT,
    column: DEFAULT_TEXT.COLUMN,
    opacity: DEFAULT_TEXT.OPACITY,
    border: {
      fill: DEFAULT_TEXT.BORDER.FILL,
      stroke: DEFAULT_TEXT.BORDER.STROKE
    }
  }
};

export const ImageElement = {
  ...BaseElement,
  type: OBJECT_TYPE.IMAGE,
  property: {
    ...BasePrintProperty,
    categoryId: 'Cover',
    name: '',
    thumbnail: DEFAULT_IMAGE.thumbnail,
    imageUrl: DEFAULT_IMAGE.imageUrl
  }
};

export const BackgroundElement = {
  ...BaseElement,
  type: OBJECT_TYPE.BACKGROUND,
  property: {
    ...BasePrintProperty,
    categoryId: 'Cover',
    type: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: '',
    thumbnail: '',
    imageUrl: ''
  }
};

export const ClipArtElement = {
  ...BaseElement,
  type: OBJECT_TYPE.CLIP_ART,
  property: {
    ...BasePrintProperty,
    category: '',
    name: '',
    thumbnail: '',
    vector: '' // imgUrl
  }
};

export const ShapeElement = {
  ...BaseElement,
  type: OBJECT_TYPE.SHAPE,
  property: {
    ...BasePrintProperty,
    category: '',
    name: '',
    thumbnail: '',
    pathData: 'img.svg' // TODO: Need discuss with FM to get instruction on using shape
  }
};
