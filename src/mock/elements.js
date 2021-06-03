import { OBJECT_TYPE } from '@/common/constants/objectType';

export const BaseProperty = {
  color: '',
  opacity: 1,
  border: {
    type: 0, // TODO: Define constants 0: No Border, 1: Line
    color: '',
    width: 0,
    style: '',
  },
  shadow: {
    enabled: false,
    color: '',
    offset: 0,
    opacity: 0,
    angle: 0,
    blur: 0,
  },
  flip: {
    horiziontal: false,
    vertical: false,
  },
};

export const BasePrintProperty = {
  ...BaseProperty,
};

export const BaseDigitalProperty = {
  ...BaseProperty,
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
  property: {
    ...BasePrintProperty,
    styleId: '',
    text: '',
    fontFamily: '',
    fontSize: '',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    color: '',
    textCase: '', // UPPERCASE, LOWERCASE, CAPITALIZE
    alignment: {
      horiziontal: '', // LEFT, CENTER, RIGHT, JUSTIFY
      vertical: '', // TOP, MIDDLE, BOTTOM
    },
    letterSpacing: 0,
    lineSpacing: 'auto',// 1.2 * em
    column: 1,
  }
};

export const ImageElement = {
  ...BaseElement,
  type: OBJECT_TYPE.IMAGE,
  property: {
    ...BasePrintProperty,
    category: 'Cover',
    name: '',
    thumbnail: '',
    imageUrl: ''
  }
};

export const BackgroundElement = {
  ...BaseElement,
  type: OBJECT_TYPE.BACKGROUND,
  property: {
    ...BasePrintProperty,
    category: 'Cover',
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
    vector: '', // imgUrl
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
    pathData: 'img.svg', // TODO: Need discuss with FM to get instruction on using shape
  }
};
