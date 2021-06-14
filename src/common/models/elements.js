import {
  OBJECT_TYPE,
  DEFAULT_PROP,
  DEFAULT_TEXT,
  DEFAULT_IMAGE,
  DEFAULT_BACKGROUND
} from '@/common/constants';

export const BaseProperty = {
  color: DEFAULT_PROP.COLOR,
  opacity: DEFAULT_PROP.OPACITY,
  border: {
    type: 0, // TODO: Define constants 0: No Border, 1: Line
    color: DEFAULT_PROP.COLOR,
    width: 0,
    style: ''
  },
  shadow: {
    enabled: false,
    color: DEFAULT_PROP.COLOR,
    offset: 0,
    opacity: DEFAULT_PROP.OPACITY,
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
    editingBorderColor: DEFAULT_TEXT.EDITING_BORDER_COLOR,
    border: {
      fill: DEFAULT_TEXT.BORDER.FILL,
      stroke: DEFAULT_TEXT.BORDER.STROKE,
      strokeWidth: DEFAULT_TEXT.BORDER.STROKE_WIDTH,
      strokeDashArray: DEFAULT_TEXT.BORDER.STROKE_DASH_ARRAY,
      strokeLineCap: DEFAULT_TEXT.BORDER.STROKE_LINE_CAP
    },
    shadow: {
      dropShadow: DEFAULT_TEXT.SHADOW.DROP_SHADOW,
      shadowBlur: DEFAULT_TEXT.SHADOW.BLUR,
      shadowOffset: DEFAULT_TEXT.SHADOW.OFFSET,
      shadowOpacity: DEFAULT_TEXT.SHADOW.OPACITY,
      shadowAngle: DEFAULT_TEXT.SHADOW.ANGLE,
      shadowColor: DEFAULT_TEXT.SHADOW.COLOR
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
    categoryId: '',
    type: DEFAULT_BACKGROUND.TYPE,
    pageType: DEFAULT_BACKGROUND.PAGE_TYPE,
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
    name: '',
    thumbnail: '',
    pathData: 'img.svg', // TODO: Need discuss with FM to get instruction on using shape
    color: DEFAULT_PROP.COLOR,
    stroke: DEFAULT_PROP.COLOR
  }
};
