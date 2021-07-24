import { IMAGE_LOCAL } from './image';

export const CANVAS_BORDER_TYPE = {
  BUTT: 'butt',
  ROUND: 'round'
};

export const BORDER_STYLES = {
  SOLID: 'solid',
  DOUBLE: 'double',
  SQUARE: 'square',
  ROUND: 'round',
  ROUGH_THICK: 'roughThick',
  ROUGH_MEDIUM: 'roughMedium',
  ROUGH_THIN: 'roughThin'
};

export const BORDER_STYLE = [
  {
    previewImageUrl: IMAGE_LOCAL.SOLID,
    value: BORDER_STYLES.SOLID,
    name: BORDER_STYLES.SOLID
  },
  {
    previewImageUrl: IMAGE_LOCAL.DOUBLE,
    value: BORDER_STYLES.DOUBLE,
    name: BORDER_STYLES.DOUBLE
  },
  {
    previewImageUrl: IMAGE_LOCAL.DASHED,
    value: BORDER_STYLES.SQUARE,
    name: BORDER_STYLES.SQUARE
  },
  {
    previewImageUrl: IMAGE_LOCAL.DOTTED,
    value: BORDER_STYLES.ROUND,
    name: BORDER_STYLES.ROUND
  },
  {
    previewImageUrl: IMAGE_LOCAL.ROUGH_THICK,
    value: BORDER_STYLES.ROUGH_THICK,
    name: BORDER_STYLES.ROUGH_THICK
  },
  {
    previewImageUrl: IMAGE_LOCAL.ROUGH_MEDIUM,
    value: BORDER_STYLES.ROUGH_MEDIUM,
    name: BORDER_STYLES.ROUGH_MEDIUM
  },
  {
    previewImageUrl: IMAGE_LOCAL.ROUGH_THIN,
    value: BORDER_STYLES.ROUGH_THIN,
    name: BORDER_STYLES.ROUGH_THIN
  }
];
