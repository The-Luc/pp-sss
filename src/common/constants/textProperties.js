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

export const BORDER_STYLE = [
  { previewImageUrl: IMAGE_LOCAL.SOLID, value: 'solid', name: 'solid' },
  { previewImageUrl: IMAGE_LOCAL.DOBULE, value: 'double', name: 'double' },
  { previewImageUrl: IMAGE_LOCAL.DASHED, value: 'square', name: 'dashed' },
  { previewImageUrl: IMAGE_LOCAL.DOTTED, value: 'round', name: 'dotted' },
  {
    previewImageUrl: IMAGE_LOCAL.ROUGH_THICK,
    value: 'roughThick',
    name: 'roughThick'
  },
  {
    previewImageUrl: IMAGE_LOCAL.ROUGH_MEDIUM,
    value: 'roughMedium',
    name: 'roughMedium'
  },
  {
    previewImageUrl: IMAGE_LOCAL.ROUGH_THIN,
    value: 'roughThin',
    name: 'roughThin'
  }
];
