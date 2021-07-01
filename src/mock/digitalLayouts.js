import { uniqueId } from 'lodash';

import { LAYOUT_TYPES, BACKGROUND_PAGE_TYPE } from '@/common/constants';
import {
  TextElement,
  BackgroundElement,
  ClipArtElement,
  ShapeElement
} from '@/common/models';

import LAYOUT_01 from '@/assets/image/layouts/thumb/layout-01.png';
import LAYOUT_02 from '@/assets/image/layouts/thumb/layout-02.png';

import BG_1 from '@/assets/image/layouts/background/background-01.jpg';
import BG_2 from '@/assets/image/layouts/background/background-02.jpg';
import BG_3 from '@/assets/image/layouts/background/background-03.jpg';
import LPCA_04531 from '@/assets/image/layouts/background/LPCA_04531.png';
import LPCA_04511 from '@/assets/image/layouts/background/LPCA_04511.png';
import BG_SINGLE_PAGE_1 from '@/assets/image/layouts/background/bg-single-page-01.jpg';
import BG_SINGLE_PAGE_2 from '@/assets/image/layouts/background/bg-single-page-02.jpg';

const text1 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 3,
    height: 3
  },
  coord: {
    x: 3,
    y: 5,
    rotation: 20 // degree
  },
  styleId: 'default',
  text: 'Sample Text',
  fontFamily: 'Arial',
  fontSize: 100,
  isBold: true,
  isItalic: true,
  isUnderline: false,
  color: '#FF0000'
};

const text2 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 3,
    height: 3
  },
  coord: {
    x: 12,
    y: 4,
    rotation: 0 // degree
  },
  styleId: 'default',
  text: 'Header Text',
  fontFamily: 'Arial',
  fontSize: 100,
  isBold: true,
  isItalic: true,
  isUnderline: false,
  color: '#FF0000'
};

const bg1 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id,
  backgroundType: '',
  category: 'Cover',
  name: 'watercolorbackground.jpg',
  thumbnail: BG_1,
  imageUrl: BG_1
};

const bg2 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id,
  backgroundType: '',
  isLeftPage: false,
  category: 'Cover',
  name: 'watercolorbackground.jpg',
  thumbnail: BG_2,
  imageUrl: BG_2
};

const bg3 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
  backgroundType: '',
  category: 'Cover',
  name: 'fullbackground.jpg',
  thumbnail: BG_3,
  imageUrl: BG_3
};

const clipArt1 = {
  ...ClipArtElement,
  id: uniqueId(),
  size: {
    width: 3,
    height: 3
  },
  coord: {
    x: 5,
    y: 5,
    rotation: 0 // degree
  },
  category: 'MSPHOTO',
  name: 'LPCA_04531',
  thumbnail: LPCA_04531,
  vector: LPCA_04531,
  fillcolor: '',
  opacity: 0
};

const clipArt2 = {
  ...ClipArtElement,
  id: uniqueId(),
  size: {
    width: 3,
    height: 3
  },
  coord: {
    x: 5,
    y: 5,
    rotation: 0 // degree
  },
  category: 'MSPHOTO',
  name: 'LPCA_04511',
  thumbnail: LPCA_04511,
  vector: LPCA_04511
};

const shape1 = {
  ...ShapeElement,
  id: uniqueId(),
  size: {
    width: 3,
    height: 3
  },
  coord: {
    x: 5,
    y: 5,
    rotation: 0 // degree
  },
  category: '',
  name: '',
  thumbnail: '',
  pathData: 'img.svg' // TODO: Need discuss with FM to get instruction on using shape
};

const textSinglePage1 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 4,
    height: 5
  },
  coord: {
    x: 3,
    y: 5,
    rotation: 20 // degree
  },
  styleId: 'default',
  text: 'Text Single 1',
  fontFamily: 'Arial',
  fontSize: 100,
  isBold: true,
  isItalic: true,
  isUnderline: false,
  color: '#FF0000',
  opacity: 0.5
};

const textSinglePage2 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 5,
    height: 5
  },
  coord: {
    x: 5,
    y: 4,
    rotation: 20 // degree
  },
  styleId: 'default',
  text: 'Text Single 2',
  fontFamily: 'Arial',
  fontSize: 100,
  isBold: true,
  isItalic: true,
  isUnderline: false,
  color: '#FF0000',
  opacity: 0.7
};

const bgSinglePage1 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: 1,
  backgroundType: '',
  isLeftPage: false,
  size: {
    width: 0,
    height: 0
  },
  coord: {
    x: 0,
    y: 0,
    rotation: 0 // degree
  },
  category: 'single',
  name: 'watercolorbackground.jpg',
  thumbnail: BG_SINGLE_PAGE_1,
  imageUrl: BG_SINGLE_PAGE_1
};

const bgSinglePage2 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: 1,
  backgroundType: '',
  isLeftPage: false,
  size: {
    width: 0,
    height: 0
  },
  coord: {
    x: 0,
    y: 0,
    rotation: 0 // degree
  },
  category: 'single',
  name: 'watercolorbackground.jpg',
  thumbnail: BG_SINGLE_PAGE_2,
  imageUrl: BG_SINGLE_PAGE_2
};

const frames = [
  {
    id: 1,
    fromLayout: true,
    objects: [bg1, bg2, text1, text2],
    previewImageUrl: LAYOUT_01
  },
  {
    id: 2,
    fromLayout: true,
    objects: [bg3, bg1, clipArt1, clipArt2],
    previewImageUrl: LAYOUT_02
  }
];

const supplementalFrames = [
  {
    id: 11,
    fromLayout: false,
    objects: [bg1, bg2, text1, text2],
    previewImageUrl: LAYOUT_01
  },
  {
    id: 12,
    fromLayout: false,
    objects: [bg3, bg1, clipArt1, clipArt2],
    previewImageUrl: LAYOUT_02
  }
];

export const packageLayouts = [
  {
    id: 1,
    name: 'Confetti',
    type: LAYOUT_TYPES.GRADUATION.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1
  }
];

export const supplementalLayouts = [
  {
    id: 21,
    name: 'Confetti',
    type: 'Supplemental',
    frames: [supplementalFrames[0]],
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1
  },
  {
    id: 22,
    name: 'Confetti 2',
    type: 'Supplemental',
    frames: [supplementalFrames[1]],
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1
  }
];

export default packageLayouts;
