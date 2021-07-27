import { uniqueId } from 'lodash';

import { BACKGROUND_PAGE_TYPE, LAYOUT_PAGE_TYPE } from '@/common/constants';
import {
  TextElement,
  BackgroundElement,
  ClipArtElement,
  ShapeElement
} from '@/common/models';

import { PRINT_LAYOUT_TYPES as LAYOUT_TYPES } from '@/mock/layoutTypes';

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
    rotation: 0 // degree
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

const textSinglePage2 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 4,
    height: 5
  },
  coord: {
    x: 3,
    y: 5,
    rotation: 0 // degree
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

const textSinglePage1 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 5,
    height: 5
  },
  coord: {
    x: 12,
    y: 4,
    rotation: 0 // degree
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

const layouts = [
  {
    id: 1,
    type: LAYOUT_TYPES.COVER.value, // PRINT ONLY
    name: 'Cover 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    objects: [bg1, bg2, text1, text2, clipArt1, clipArt2, shape1],
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 2,
    type: LAYOUT_TYPES.COVER.value,
    name: 'Cover 2',
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    isFavorites: false,
    objects: [bg3, text1, text2],
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 3,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Collage 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    objects: [bg1, bg2, text1, text2],
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 4,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin & staff',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    objects: [bg3, text2],
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 5,
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Clubs, Group',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    objects: [bg1, bg2, text1],
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 6,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 7,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards Superlative',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 8,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin Staff 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 9,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 10,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro page 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 11,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Club 7',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 7,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 12,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple  3',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 3,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 13,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  2',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 2,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 14,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  4',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 4,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 15,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award 5',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 3,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 16,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 12',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 2,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 17,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 4',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 4,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 18,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 8,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 19,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 8,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 20,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro 2',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 2,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 21,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 4',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 4,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 22,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 5',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 5,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 23,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 24,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 25,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 9,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 26,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 10',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 10,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 27,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 11',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 11,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 28,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards 10',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 10,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 29,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 9,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 30,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 31,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 9,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 32,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 33,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage1, textSinglePage1],
    name: 'Single 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6,
    pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
  },
  {
    id: 34,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage1, textSinglePage1],
    name: 'Single 7',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 6,
    pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
  },
  {
    id: 35,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },

  {
    id: 36,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 36',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.FULL_PAGE.id
  },
  {
    id: 37,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage1, textSinglePage1],
    name: 'Single 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
  },

  {
    id: 38,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage2, textSinglePage2],
    name: 'Single 2',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
  }
];

export default layouts;
