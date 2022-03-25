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

export const LAYOUT_TYPES = {
  COVER: {
    value: 1,
    name: 'Cover',
    sheetType: SHEET_TYPE.COVER
  },
  COLLAGE: {
    value: 2,
    name: 'Collage',
    sheetType: SHEET_TYPE.NORMAL
  },
  LETTER_FROM: {
    value: 3,
    name: 'Letter From...',
    sheetType: SHEET_TYPE.NORMAL
  },
  ADMIN_STAFF: {
    id: 4,
    name: 'Admin & Staff'
  },
  CLUBS_GROUPS_TEAMS: {
    value: 5,
    name: 'Clubs, Groups & Teams',
    sheetType: SHEET_TYPE.NORMAL
  },
  SIGNATURES: {
    value: 6,
    name: 'Signatures',
    sheetType: SHEET_TYPE.NORMAL
  },
  AWARDS_SUPERLATIVES: {
    value: 7,
    name: 'Awards/Superlatives',
    sheetType: SHEET_TYPE.NORMAL
  },
  GRADUATION: {
    value: 8,
    name: 'Graduation',
    sheetType: SHEET_TYPE.NORMAL
  },
  PORTRAIT: {
    value: 9,
    name: 'Portrait',
    sheetType: SHEET_TYPE.NORMAL
  },
  INTRO_OPENING: {
    value: 10,
    name: 'Intro/Opening Page',
    sheetType: SHEET_TYPE.NORMAL
  },
  YEAR_REVIEW: {
    value: 11,
    name: 'Year in Review',
    sheetType: SHEET_TYPE.NORMAL
  },
  SIMPLE: {
    value: 12,
    name: 'Simple',
    sheetType: SHEET_TYPE.NORMAL
  },
  SINGLE_PAGE: {
    value: 13,
    name: 'Single Page',
    sheetType: SHEET_TYPE.FRONT_COVER
  },
  MISC: {
    value: 14,
    name: 'Misc',
    sheetType: SHEET_TYPE.NORMAL
  }
};

export const PRINT_LAYOUT_TYPES = { ...LAYOUT_TYPES };

export const DIGITAL_LAYOUT_TYPES = {
  ...LAYOUT_TYPES,
  SUPPLEMENTAL_LAYOUTS: {
    name: 'Supplemental: Digital Only',
    value: 'Supplemental'
  }
};

export const CUSTOM_LAYOUT_TYPE = -999;

export const SAVED_AND_FAVORITES = {
  name: 'Saved Layouts/Favorites',
  id: -999,
  value: -999,
  subItems: Object.values(LAYOUT_PAGE_TYPE).map(lgt => ({
    ...lgt,
    value: lgt.id,
    isDisabled: false
  }))
};
