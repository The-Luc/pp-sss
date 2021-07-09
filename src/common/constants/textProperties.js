import { IMAGE_LOCAL } from './image';

export const THINKNESS_OPTIONS = [
  { name: '0.25 pt', value: 0.25 },
  { name: '0.5 pt', value: 0.5 },
  { name: '0.75 pt', value: 0.75 },
  { name: '1 pt', value: 1 },
  { name: '2 pt', value: 2 },
  { name: '3 pt', value: 3 },
  { name: '4 pt', value: 4 },
  { name: '5 pt', value: 5 },
  { name: '6 pt', value: 6 },
  { name: '7 pt', value: 7 },
  { name: '8 pt', value: 8 },
  { name: '9 pt', value: 9 },
  { name: '10 pt', value: 10 },
  { name: '12 pt', value: 12 },
  { name: '14 pt', value: 14 },
  { name: '16 pt', value: 16 },
  { name: '18 pt', value: 18 },
  { name: '20 pt', value: 20 },
  { name: '30 pt', value: 30 }
];

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
