import { SHEET_TYPE } from './sheetType';

export const LAYOUT_PAGE_TYPE = {
  SINGLE_PAGE: {
    id: 0,
    name: 'Single Page Layouts',
    shortName: 'Single'
  },
  FULL_PAGE: {
    id: 1,
    name: 'Spread Layouts',
    shortName: 'Spread'
  }
};

export const LAYOUT_SIZE_TYPES = {
  HARD: 0,
  SOFT: 1,
  NORMAL: 2
};

export const LAYOUT_TYPES = {
  ALL: {
    value: 1,
    name: 'All',
    sheetType: SHEET_TYPE.NORMAL
  },
  COVER: {
    value: 2,
    name: 'Cover',
    sheetType: SHEET_TYPE.COVER
  },
  COLLAGE: {
    value: 3,
    name: 'Collage',
    sheetType: SHEET_TYPE.NORMAL
  },
  LETTER_FROM: {
    value: 4,
    name: 'Letter From...',
    sheetType: SHEET_TYPE.NORMAL
  },
  ADMIN_STAFF: {
    value: 5,
    name: 'Admin & Staff',
    sheetType: SHEET_TYPE.NORMAL
  },
  CLUBS_GROUPS_TEAMS: {
    value: 6,
    name: 'Clubs, Groups & Teams',
    sheetType: SHEET_TYPE.NORMAL
  },
  SIGNATURES: {
    value: 7,
    name: 'Signatures',
    sheetType: SHEET_TYPE.BACK_COVER
  },
  AWARDS_SUPERLATIVES: {
    value: 8,
    name: 'Awards/Superlatives',
    sheetType: SHEET_TYPE.NORMAL
  },
  GRADUATION: {
    value: 9,
    name: 'Graduation',
    sheetType: SHEET_TYPE.NORMAL
  },
  PORTRAIT: {
    value: 10,
    name: 'Portrait',
    sheetType: SHEET_TYPE.NORMAL
  },
  INTRO_OPENING: {
    value: 11,
    name: 'Intro/Opening Page',
    sheetType: SHEET_TYPE.FRONT_COVER
  },
  YEAR_REVIEW: {
    value: 12,
    name: 'Year in Review',
    sheetType: SHEET_TYPE.NORMAL
  },
  SIMPLE: {
    value: 13,
    name: 'Simple',
    sheetType: SHEET_TYPE.NORMAL
  },
  MISC: {
    value: 14,
    name: 'Misc',
    sheetType: SHEET_TYPE.NORMAL
  }
};

export const CUSTOM_LAYOUT_TYPE = -999;
export const ASSORTED_TYPE_VALUE = -998;
export const SUPPLEMENTAL_TYPE_VALUE = 'Supplemental';

export const ASSORTED_TYPE = {
  ASSORTED: {
    value: ASSORTED_TYPE_VALUE,
    name: 'Assorted (Not Theme Specific)',
    sheetType: SHEET_TYPE.NORMAL
  }
};

export const SINGLE_PAGE_LAYOUT_TYPE_IDS = [
  LAYOUT_TYPES.INTRO_OPENING.value,
  LAYOUT_TYPES.SIGNATURES.value
];

export const PRINT_LAYOUT_TYPES = { ...LAYOUT_TYPES, ...ASSORTED_TYPE };

export const DIGITAL_LAYOUT_TYPES = {
  ...LAYOUT_TYPES,
  ...ASSORTED_TYPE,
  SUPPLEMENTAL_LAYOUTS: {
    name: 'Supplemental: Digital Only',
    value: SUPPLEMENTAL_TYPE_VALUE,
    id: SUPPLEMENTAL_TYPE_VALUE,
    subItems: []
  }
};

export const SAVED_AND_FAVORITES_TYPE = {
  name: 'Saved Layouts/Favorites',
  id: CUSTOM_LAYOUT_TYPE,
  value: CUSTOM_LAYOUT_TYPE,
  subItems: []
};

export const SAVED_AND_FAVORITES = {
  ...SAVED_AND_FAVORITES_TYPE,
  subItems: Object.values(LAYOUT_PAGE_TYPE).map(lgt => ({
    ...lgt,
    value: lgt.id,
    isDisabled: false
  }))
};
