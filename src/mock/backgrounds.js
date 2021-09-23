import { isEmpty } from '@/common/utils';

import { BackgroundElementEntity as BackgroundElement } from '@/common/models/entities/elements';
import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from '@/common/constants';

import THEME_1 from '@/assets/image/backgrounds/theme-1.png';
import THEME_2 from '@/assets/image/backgrounds/theme-2.png';
import THEME_3 from '@/assets/image/backgrounds/theme-3.png';
import THEME_4 from '@/assets/image/backgrounds/theme-4.png';
import THEME_5 from '@/assets/image/backgrounds/theme-5.png';
import THEME_6 from '@/assets/image/backgrounds/theme-6.png';
import THEME_7 from '@/assets/image/backgrounds/theme-7.png';
import THEME_8 from '@/assets/image/backgrounds/theme-8.jpg';
import THEME_9 from '@/assets/image/backgrounds/theme-9.jpg';

import COLOR_1 from '@/assets/image/backgrounds/color-1.png';
import COLOR_2 from '@/assets/image/backgrounds/color-2.png';
import COLOR_3 from '@/assets/image/backgrounds/color-3.png';
import COLOR_4 from '@/assets/image/backgrounds/color-4.png';
import COLOR_5 from '@/assets/image/backgrounds/color-5.png';
import COLOR_6 from '@/assets/image/backgrounds/color-6.png';
import COLOR_7 from '@/assets/image/backgrounds/color-7.png';

const CATEGORIES = [
  {
    id: 0,
    name: 'Abstract'
  },
  {
    id: 1,
    name: 'Cartoon'
  },
  {
    id: 2,
    name: 'Color'
  },
  {
    id: 3,
    name: 'Holiday'
  },
  {
    id: 4,
    name: 'USA'
  }
];

export const BACKGROUND_CATEGORIES = CATEGORIES.map(c => ({
  ...c,
  value: c.id
}));

export const BACKGROUNDS = [
  new BackgroundElement({
    id: 0,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Comic Too 1',
    thumbnail: THEME_1,
    imageUrl: THEME_1
  }),
  new BackgroundElement({
    id: 1,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Comic Too 2',
    thumbnail: THEME_2,
    imageUrl: THEME_2
  }),
  new BackgroundElement({
    id: 2,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Comic Too 3',
    thumbnail: THEME_3,
    imageUrl: THEME_3
  }),
  new BackgroundElement({
    id: 3,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Comic Too 4',
    thumbnail: THEME_4,
    imageUrl: THEME_4
  }),
  new BackgroundElement({
    id: 4,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Comic Too 5',
    thumbnail: THEME_5,
    imageUrl: THEME_5
  }),
  new BackgroundElement({
    id: 5,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Color 1',
    thumbnail: COLOR_1,
    imageUrl: COLOR_1
  }),
  new BackgroundElement({
    id: 6,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Color 2',
    thumbnail: COLOR_2,
    imageUrl: COLOR_2
  }),
  new BackgroundElement({
    id: 7,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Color 3',
    thumbnail: COLOR_3,
    imageUrl: COLOR_3
  }),
  new BackgroundElement({
    id: 8,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Color 4',
    thumbnail: COLOR_4,
    imageUrl: COLOR_4
  }),
  new BackgroundElement({
    id: 9,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.FULL_PAGE.id,
    name: 'Color 5',
    thumbnail: COLOR_5,
    imageUrl: COLOR_5
  }),
  new BackgroundElement({
    id: 10,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id,
    name: 'Color 6',
    thumbnail: COLOR_6,
    imageUrl: COLOR_6
  }),
  new BackgroundElement({
    id: 11,
    categoryId: 2,
    backgroundType: BACKGROUND_TYPE.CATEGORY.id,
    pageType: BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id,
    name: 'Color 7',
    thumbnail: COLOR_7,
    imageUrl: COLOR_7
  }),
  new BackgroundElement({
    id: 12,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id,
    name: 'Category - 6',
    thumbnail: THEME_6,
    imageUrl: THEME_6
  }),
  new BackgroundElement({
    id: 13,
    categoryId: 1,
    backgroundType: BACKGROUND_TYPE.THEME.id,
    pageType: BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id,
    name: 'Category - 7',
    thumbnail: THEME_7,
    imageUrl: THEME_7
  })
];

const pageBgs = [COLOR_6, THEME_7, COLOR_7, THEME_8, THEME_9];
const frameBgs = [COLOR_1, COLOR_2, COLOR_3, COLOR_4, COLOR_5];

const backgroundPages = {};
const backgroundFrames = {};

export const getBackgroundOfPage = pageNo => {
  if (isEmpty(backgroundPages[pageNo])) {
    backgroundPages[pageNo] =
      pageBgs[Math.floor(Math.random() * pageBgs.length)];
  }

  return backgroundPages[pageNo];
};

export const getBackgroundOfFrame = frameNo => {
  if (isEmpty(backgroundFrames[frameNo])) {
    backgroundFrames[frameNo] =
      frameBgs[Math.floor(Math.random() * frameBgs.length)];
  }

  return backgroundFrames[frameNo];
};
