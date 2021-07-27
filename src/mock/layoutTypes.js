import { LAYOUT_PAGE_TYPE, SHEET_TYPE } from '@/common/constants';

const LAYOUT_TYPES = {
  COVER: {
    name: 'Cover',
    value: 'cover',
    sheetType: SHEET_TYPE.COVER
  },
  COLLAGE: {
    name: 'Collage',
    value: 'collage',
    sheetType: SHEET_TYPE.NORMAL
  },
  ADMIN_STAFF: {
    name: 'Admin & Staff',
    value: 'adminStaff',
    sheetType: SHEET_TYPE.NORMAL
  },
  CLUBS_GROUPS_TEAMS: {
    name: 'Clubs, Groups and Teams',
    value: 'clubGroupsTeams',
    sheetType: SHEET_TYPE.NORMAL
  },
  SIGNATURES: {
    name: 'Signatures',
    value: 'signatures',
    sheetType: SHEET_TYPE.NORMAL
  },
  AWARDS_SUPERLATIVE: {
    name: 'Awards/Superlatives',
    value: 'awardsSuperlatives',
    sheetType: SHEET_TYPE.NORMAL
  },
  GRADUATION: {
    name: 'Graduation',
    value: 'graduation',
    sheetType: SHEET_TYPE.NORMAL
  },
  INTRO_OPENING_PAGE: {
    name: 'Intro/Opening Page',
    value: 'introOpeningPage',
    sheetType: SHEET_TYPE.NORMAL
  },
  YEAR_IN_REVIEW: {
    name: 'Year in Review',
    value: 'yearInReview',
    sheetType: SHEET_TYPE.NORMAL
  },
  SIMPLE: {
    name: 'Simple',
    value: 'simple',
    sheetType: SHEET_TYPE.NORMAL
  },
  SINGLE_PAGE: {
    name: 'Single Page',
    value: 'singlePage',
    sheetType: SHEET_TYPE.FRONT_COVER
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
