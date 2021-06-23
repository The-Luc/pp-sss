import { uniqueId } from 'lodash';

import { LAYOUT_TYPES } from '@/common/constants/layoutTypes';
import {
  TextElement,
  BackgroundElement,
  ClipArtElement,
  ShapeElement
} from '../common/models';

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
  pageType: 1,
  category: 'Cover',
  name: 'watercolorbackground.jpg',
  thumbnail:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/700/original_watercolorbackground.jpg',
  imageUrl:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/700/original_watercolorbackground.jpg'
};

const bg2 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: 1,
  isLeft: false,
  size: {
    width: 0,
    height: 0
  },
  coord: {
    x: 0,
    y: 0,
    rotation: 0 // degree
  },
  category: 'Cover',
  name: 'watercolorbackground.jpg',
  thumbnail:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/233/original_papertree.jpg',
  imageUrl:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/233/original_papertree.jpg'
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
  thumbnail:
    'http://s3.amazonaws.com/fms.prod/yb_clipart/global/1725/LPCA_04531.png?2013',
  vector:
    'https://s3.amazonaws.com/fms.prod/yb_clipart/global/1725/LPCA_04531.svg?2013', // imgUrl
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
  thumbnail:
    'http://s3.amazonaws.com/fms.prod/yb_clipart/global/1715/LPCA_04511.png?2013',
  vector:
    'https://s3.amazonaws.com/fms.prod/yb_clipart/global/1715/LPCA_04511.svg?2013' // imgUrl
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
  isLeft: false,
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
  thumbnail:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/1348/original_whiter-right.jpg?2017',
  imageUrl:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/1348/original_whiter-right.jpg?2017'
};

const bgSinglePage2 = {
  ...BackgroundElement,
  id: uniqueId(),
  pageType: 1,
  isLeft: false,
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
  thumbnail:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/1345/original_greenboard-left.jpg?2017',
  imageUrl:
    'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/1345/original_greenboard-left.jpg?2017'
};

const layouts = [
  {
    id: 1,
    type: LAYOUT_TYPES.COVER.value, // PRINT ONLY
    name: 'Cover 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    objects: [bg1, bg2, text1, text2, clipArt1, clipArt2, shape1]
  },
  {
    id: 2,
    type: LAYOUT_TYPES.COVER.value,
    name: 'Cover 2',
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    isFavorites: false,
    objects: [bg1, bg2, text1, text2]
  },
  {
    id: 3,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Collage 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    objects: [bg1, bg2, text1, text2]
  },
  {
    id: 4,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin & staff',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    objects: [bg1, bg2, text2]
  },
  {
    id: 5,
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Clubs, Group',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    objects: [bg1, bg2, text1]
  },
  {
    id: 6,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },
  {
    id: 7,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards Superlative',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },
  {
    id: 8,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin Staff 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },
  {
    id: 9,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },
  {
    id: 10,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro page 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },
  {
    id: 11,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Club 7',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 7
  },
  {
    id: 12,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple  3',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 3
  },
  {
    id: 13,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  2',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 2
  },
  {
    id: 14,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  4',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 4
  },
  {
    id: 15,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award 5',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 3
  },
  {
    id: 16,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 12',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 2
  },
  {
    id: 17,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 4',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 4
  },
  {
    id: 18,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 8
  },
  {
    id: 19,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 8
  },
  {
    id: 20,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro 2',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 2
  },
  {
    id: 21,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 4',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 4
  },
  {
    id: 22,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 5',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 5
  },
  {
    id: 23,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 6
  },
  {
    id: 24,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 6
  },
  {
    id: 25,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 9
  },
  {
    id: 26,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 10',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 10
  },
  {
    id: 27,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 11',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 11
  },
  {
    id: 28,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards 10',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 10
  },
  {
    id: 29,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 9
  },
  {
    id: 30,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 6
  },
  {
    id: 31,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 9
  },
  {
    id: 32,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 6
  },
  {
    id: 33,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage1, textSinglePage1],
    name: 'Single 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 6
  },
  {
    id: 34,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage1, textSinglePage1],
    name: 'Single 7',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2326/f95301bacceccd2c84a8282c2226b60aac6016c2.jpg?1612487744',
    themeId: 6
  },
  {
    id: 35,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },

  {
    id: 36,
    objects: [bg1, bg2, text1, text2],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 36',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },
  {
    id: 37,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage1, textSinglePage1],
    name: 'Single 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },

  {
    id: 38,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    objects: [bgSinglePage2, textSinglePage2],
    name: 'Single 2',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2326/f95301bacceccd2c84a8282c2226b60aac6016c2.jpg?1612487744',
    themeId: 1
  }
];

export default layouts;
