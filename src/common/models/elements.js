import {
  OBJECT_TYPE,
  DEFAULT_PROP,
  DEFAULT_TEXT,
  DEFAULT_BACKGROUND,
  DEFAULT_SHAPE,
  DEFAULT_CLIP_ART,
  DEFAULT_SHADOW,
  DEFAULT_BORDER
} from '@/common/constants';

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
  },
  color: DEFAULT_PROP.COLOR,
  opacity: DEFAULT_PROP.OPACITY,
  border: {
    showBorder: DEFAULT_BORDER.SHOW_BORDER,
    stroke: DEFAULT_BORDER.STROKE,
    strokeWidth: DEFAULT_BORDER.STROKE_WIDTH,
    strokeDashArray: DEFAULT_BORDER.STROKE_DASH_ARRAY,
    strokeLineType: DEFAULT_BORDER.STROKE_LINE_TYPE
  },
  shadow: {
    dropShadow: DEFAULT_SHADOW.DROP_SHADOW,
    shadowBlur: DEFAULT_SHADOW.BLUR,
    shadowOffset: DEFAULT_SHADOW.OFFSET,
    shadowOpacity: DEFAULT_SHADOW.OPACITY,
    shadowAngle: DEFAULT_SHADOW.ANGLE,
    shadowColor: DEFAULT_SHADOW.COLOR
  },
  flip: {
    horizontal: false,
    vertical: false
  }
};

export const BasePrintProperty = {
  ...BaseElement
};

export const BaseDigitalProperty = {
  ...BaseElement
};

export const TextElement = {
  ...BaseElement,
  type: OBJECT_TYPE.TEXT,
  coord: {
    x: DEFAULT_TEXT.COORD.X,
    y: DEFAULT_TEXT.COORD.Y,
    rotation: DEFAULT_TEXT.COORD.ROTATION // degree
  },
  size: DEFAULT_TEXT.SIZE,
  styleId: DEFAULT_TEXT.STYLE_ID,
  text: DEFAULT_TEXT.TEXT,
  fontFamily: DEFAULT_TEXT.FONT_FAMILY,
  fontSize: DEFAULT_TEXT.FONT_SIZE,
  isBold: DEFAULT_TEXT.IS_BOLD,
  isItalic: DEFAULT_TEXT.IS_ITALIC,
  isUnderline: DEFAULT_TEXT.IS_UNDERLINE,
  textCase: DEFAULT_TEXT.TEXT_CASE, // UPPERCASE, LOWERCASE, CAPITALIZE
  alignment: {
    horizontal: DEFAULT_TEXT.ALIGNMENT.HORIZONTAL, // LEFT, CENTER, RIGHT, JUSTIFY
    vertical: DEFAULT_TEXT.ALIGNMENT.VERTICAL // TOP, MIDDLE, BOTTOM
  },
  letterSpacing: DEFAULT_TEXT.LETTER_SPACING,
  charSpacing: DEFAULT_TEXT.CHAR_SPACING,
  lineSpacing: DEFAULT_TEXT.LINE_SPACING, // 1.2 * em
  lineHeight: DEFAULT_TEXT.LINE_HEIGHT,
  column: DEFAULT_TEXT.COLUMN,
  editingBorderColor: DEFAULT_TEXT.EDITING_BORDER_COLOR,
  isConstrain: DEFAULT_TEXT.IS_CONSTRAIN
};

export const ImageElement = {
  ...BaseElement, // opacity, shadow, border, size, flip
  type: OBJECT_TYPE.IMAGE,
  styleId: 0,
  imageUrl: '',
  centerCrop: {
    cropTop: 0,
    cropBottom: 0,
    cropLeft: 0,
    cropRight: 0
  }
};

export const BackgroundElement = {
  ...BaseElement,
  type: OBJECT_TYPE.BACKGROUND,
  backgroundId: '', // to store the id of background on menu
  categoryId: '',
  backgroundType: DEFAULT_BACKGROUND.BACKGROUND_TYPE,
  pageType: DEFAULT_BACKGROUND.PAGE_TYPE,
  isLeftPage: DEFAULT_BACKGROUND.IS_LEFT,
  name: '',
  thumbnail: '',
  imageUrl: ''
};

export const ClipArtElement = {
  ...BaseElement,
  type: OBJECT_TYPE.CLIP_ART,
  size: {
    width: DEFAULT_CLIP_ART.WIDTH,
    height: DEFAULT_CLIP_ART.HEIGHT
  },
  shadow: {
    dropShadow: DEFAULT_CLIP_ART.SHADOW.DROP_SHADOW,
    shadowBlur: DEFAULT_CLIP_ART.SHADOW.BLUR,
    shadowOffset: DEFAULT_CLIP_ART.SHADOW.OFFSET,
    shadowOpacity: DEFAULT_CLIP_ART.SHADOW.OPACITY,
    shadowAngle: DEFAULT_CLIP_ART.SHADOW.ANGLE,
    shadowColor: DEFAULT_CLIP_ART.SHADOW.COLOR
  },
  category: '',
  name: '',
  thumbnail: '',
  vector: '', // imgUrl
  isColorful: false,
  isConstrain: DEFAULT_CLIP_ART.IS_CONSTRAIN
};

export const ShapeElement = {
  ...BaseElement,
  type: OBJECT_TYPE.SHAPE,
  size: {
    width: DEFAULT_SHAPE.WIDTH,
    height: DEFAULT_SHAPE.HEIGHT
  },
  shadow: {
    dropShadow: DEFAULT_SHAPE.SHADOW.DROP_SHADOW,
    shadowBlur: DEFAULT_SHAPE.SHADOW.BLUR,
    shadowOffset: DEFAULT_SHAPE.SHADOW.OFFSET,
    shadowOpacity: DEFAULT_SHAPE.SHADOW.OPACITY,
    shadowAngle: DEFAULT_SHAPE.SHADOW.ANGLE,
    shadowColor: DEFAULT_SHAPE.SHADOW.COLOR
  },
  name: '',
  thumbnail: '',
  pathData: '', // TODO: Need discuss with FM to get instruction on using shape
  color: DEFAULT_PROP.COLOR,
  stroke: DEFAULT_PROP.COLOR,
  isConstrain: true
};
