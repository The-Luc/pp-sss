export const BACKGROUND_TYPE_NAME = {
  THEME: 'THEME',
  CATEGORY: 'CATEGORY',
  CUSTOM: 'CUSTOM',
  FAVORITE: 'FAVORITE'
};

export const BACKGROUND_TYPE = {
  [BACKGROUND_TYPE_NAME.THEME]: {
    id: 0,
    name: 'Theme'
  },
  [BACKGROUND_TYPE_NAME.CATEGORY]: {
    id: 1,
    name: 'Category'
  },
  [BACKGROUND_TYPE_NAME.CUSTOM]: {
    id: 2,
    name: 'Custom Backgrounds'
  },
  [BACKGROUND_TYPE_NAME.FAVORITE]: {
    id: 3,
    name: 'Saved Favorites'
  }
};

export const BACKGROUND_PAGE_TYPE = {
  FULL_PAGE: {
    id: 0,
    name: 'General'
  },
  SINGLE_PAGE: {
    id: 1,
    name: 'Single Page'
  }
};
