import { uniqueId } from 'lodash';

import { LAYOUT_TYPES, BACKGROUND_PAGE_TYPE } from '@/common/constants';
import {
  TextElement,
  BackgroundElement,
  ClipArtElement,
  ShapeElement
} from '@/common/models';

import LAYOUT_THUMB_01 from '@/assets/image/digital-layouts/thumb/layout-1.jpg';
import LAYOUT_THUMB_02 from '@/assets/image/digital-layouts/thumb/layout-2.jpg';
import LAYOUT_THUMB_03 from '@/assets/image/digital-layouts/thumb/layout-3.jpg';
import LAYOUT_THUMB_04 from '@/assets/image/digital-layouts/thumb/layout-4.jpg';
import LAYOUT_THUMB_05 from '@/assets/image/digital-layouts/thumb/layout-5.jpg';
import LAYOUT_THUMB_06 from '@/assets/image/digital-layouts/thumb/layout-6.jpg';
import LAYOUT_THUMB_07 from '@/assets/image/digital-layouts/thumb/layout-7.jpg';
import LAYOUT_THUMB_08 from '@/assets/image/digital-layouts/thumb/layout-8.jpg';
import LAYOUT_THUMB_09 from '@/assets/image/digital-layouts/thumb/layout-9.jpg';
import LAYOUT_THUMB_10 from '@/assets/image/digital-layouts/thumb/layout-10.jpg';
import LAYOUT_THUMB_11 from '@/assets/image/digital-layouts/thumb/layout-11.jpg';
import LAYOUT_THUMB_12 from '@/assets/image/digital-layouts/thumb/layout-12.jpg';
import LAYOUT_THUMB_13 from '@/assets/image/digital-layouts/thumb/layout-13.jpg';
import LAYOUT_THUMB_14 from '@/assets/image/digital-layouts/thumb/layout-14.jpg';
import LAYOUT_THUMB_15 from '@/assets/image/digital-layouts/thumb/layout-15.jpg';
import LAYOUT_THUMB_16 from '@/assets/image/digital-layouts/thumb/layout-16.jpg';
import LAYOUT_THUMB_17 from '@/assets/image/digital-layouts/thumb/layout-17.jpg';
import LAYOUT_THUMB_18 from '@/assets/image/digital-layouts/thumb/layout-18.jpg';
import LAYOUT_THUMB_19 from '@/assets/image/digital-layouts/thumb/layout-19.jpg';
import LAYOUT_THUMB_20 from '@/assets/image/digital-layouts/thumb/layout-20.jpg';
import LAYOUT_THUMB_21 from '@/assets/image/digital-layouts/thumb/layout-21.jpg';

import LAYOUT_01 from '@/assets/image/digital-layouts/layout-1.jpg';
import LAYOUT_02 from '@/assets/image/digital-layouts/layout-2.jpg';
import LAYOUT_03 from '@/assets/image/digital-layouts/layout-3.jpg';
import LAYOUT_04 from '@/assets/image/digital-layouts/layout-4.jpg';
import LAYOUT_05 from '@/assets/image/digital-layouts/layout-5.jpg';
import LAYOUT_06 from '@/assets/image/digital-layouts/layout-6.jpg';

import LPCA_04531 from '@/assets/image/layouts/background/LPCA_04531.png';
import LPCA_04511 from '@/assets/image/layouts/background/LPCA_04511.png';

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

const backgroundData = [
  {
    thumbnail: LAYOUT_THUMB_01,
    imageUrl: LAYOUT_01
  },
  {
    thumbnail: LAYOUT_THUMB_02,
    imageUrl: LAYOUT_02
  },
  {
    thumbnail: LAYOUT_THUMB_03,
    imageUrl: LAYOUT_03
  },
  {
    thumbnail: LAYOUT_THUMB_04,
    imageUrl: LAYOUT_04
  },
  {
    thumbnail: LAYOUT_THUMB_05,
    imageUrl: LAYOUT_05
  },
  {
    thumbnail: LAYOUT_THUMB_06,
    imageUrl: LAYOUT_06
  }
];

const backgrounds = backgroundData.map(data => {
  return {
    ...BackgroundElement,
    id: uniqueId(),
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    backgroundType: '',
    category: 'Cover',
    name: 'watercolorbackground.jpg',
    thumbnail: data.thumbnail,
    imageUrl: data.imageUrl
  };
});

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

const frames = [
  {
    id: 1,
    fromLayout: true,
    objects: [backgrounds[0], text1, text2],
    previewImageUrl: LAYOUT_THUMB_01,
    isVisited: false
  },
  {
    id: 2,
    fromLayout: true,
    objects: [backgrounds[1], clipArt1, clipArt2],
    previewImageUrl: LAYOUT_THUMB_02,
    isVisited: false
  }
];

const frames2 = [
  {
    id: 1,
    fromLayout: true,
    objects: [backgrounds[3], text1, text2],
    previewImageUrl: LAYOUT_THUMB_03,
    isVisited: false
  },
  {
    id: 2,
    fromLayout: true,
    objects: [backgrounds[4], text2, shape1],
    previewImageUrl: LAYOUT_THUMB_04,
    isVisited: false
  },
  {
    id: 3,
    fromLayout: true,
    objects: [backgrounds[5], clipArt1, clipArt2],
    previewImageUrl: LAYOUT_THUMB_05,
    isVisited: false
  }
];
const supplementalFrames = [
  {
    id: 11,
    fromLayout: false,
    objects: [backgrounds[5], text1, text2],
    previewImageUrl: LAYOUT_THUMB_01,
    isVisited: false
  },
  {
    id: 12,
    fromLayout: false,
    objects: [backgrounds[2], clipArt1, clipArt2],
    previewImageUrl: LAYOUT_THUMB_05,
    isVisited: false
  }
];

export const packageLayouts = [
  {
    id: 1,
    name: '3D',
    type: LAYOUT_TYPES.COVER.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_01,
    themeId: 1
  },
  {
    id: 2,
    name: 'Three Frames',
    type: LAYOUT_TYPES.COLLAGE.value,
    frames: [...frames2],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_02,
    themeId: 1
  },
  {
    id: 3,
    name: 'Four Frames',
    type: LAYOUT_TYPES.COLLAGE.value,
    frames: [...frames2, frames[0]],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_03,
    themeId: 1
  },
  {
    id: 4,
    name: 'Nature',
    type: LAYOUT_TYPES.COLLAGE.value,
    frames: [...frames2],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_04,
    themeId: 1
  },
  {
    id: 5,
    name: 'School',
    type: LAYOUT_TYPES.COLLAGE.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_05,
    themeId: 1
  },
  {
    id: 6,
    name: 'Confetti',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_06,
    themeId: 4
  },
  {
    id: 7,
    name: 'Glitch',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_07,
    themeId: 5
  },
  {
    id: 8,
    name: 'Glitch',
    type: LAYOUT_TYPES.COLLAGE.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_08,
    themeId: 1
  },
  {
    id: 9,
    name: '3D',
    type: LAYOUT_TYPES.COLLAGE.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_09,
    themeId: 1
  },
  {
    id: 10,
    name: 'Nature',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_10,
    themeId: 6
  },
  {
    id: 11,
    name: 'Pixel',
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_11,
    themeId: 7
  },
  {
    id: 12,
    name: 'Scribble',
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_12,
    themeId: 1
  },
  {
    id: 13,
    name: 'Confetti',
    type: LAYOUT_TYPES.GRADUATION.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_13,
    themeId: 1
  },
  {
    id: 14,
    name: 'Confetti',
    type: LAYOUT_TYPES.COVER.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_14,
    themeId: 1
  },
  {
    id: 15,
    name: 'Confetti',
    type: LAYOUT_TYPES.GRADUATION.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_15,
    themeId: 1
  },
  {
    id: 16,
    name: 'Confetti',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_16,
    themeId: 1
  },
  {
    id: 17,
    name: 'Confetti',
    type: LAYOUT_TYPES.GRADUATION.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_17,
    themeId: 1
  },
  {
    id: 18,
    name: 'Confetti',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_18,
    themeId: 1
  },
  {
    id: 19,
    name: 'Confetti',
    type: LAYOUT_TYPES.GRADUATION.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_19,
    themeId: 1
  },
  {
    id: 20,
    name: 'Confetti',
    type: LAYOUT_TYPES.GRADUATION.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_20,
    themeId: 1
  },
  {
    id: 21,
    name: 'Confetti',
    type: LAYOUT_TYPES.COVER.value,
    frames: [...frames],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_21,
    themeId: 1
  }
];

export const supplementalLayouts = [
  {
    id: 31,
    name: 'Confetti',
    type: 'Supplemental',
    frames: [supplementalFrames[0]],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_02,
    themeId: 1
  },
  {
    id: 32,
    name: 'Confetti 2',
    type: 'Supplemental',
    frames: [supplementalFrames[1]],
    isFavorites: false,
    previewImageUrl: LAYOUT_THUMB_10,
    themeId: 1
  }
];

export default packageLayouts;
