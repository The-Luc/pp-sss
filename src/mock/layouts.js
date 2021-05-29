const { LAYOUT_TYPES } = require('@/common/constants');

const layouts = [
  {
    id: 1,
    imageUrlLeft: 'layout1l.jpg',
    imageUrlRight: 'layout1r.jpg',
    type: LAYOUT_TYPES.COVER.value,
    name: 'Cover 1',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 2,
    imageUrlLeft: 'layout2l.jpg',
    imageUrlRight: 'layout2r.jpg',
    type: LAYOUT_TYPES.COVER.value,
    name: 'Cover 2',
    themeId: 1
  },
  {
    id: 3,
    imageUrlLeft: 'layout4l.jpg',
    imageUrlRight: 'layout4r.jpg',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Collage 1',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 4,
    imageUrlLeft: 'layout4l.jpg',
    imageUrlRight: 'layout4r.jpg',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin & staff',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 5,
    imageUrlLeft: 'layout5l.jpg',
    imageUrlRight: 'layout5r.jpg',
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Clubs, Group',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 6,
    imageUrlLeft: 'layout6l.jpg',
    imageUrlRight: 'layout6r.jpg',
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 7,
    imageUrlLeft: 'layout7l.jpg',
    imageUrlRight: 'layout7r.jpg',
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards Superlative',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 8,
    imageUrlLeft: 'layout8l.jpg',
    imageUrlRight: 'layout8r.jpg',
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin Staff 1',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 9,
    imageUrlLeft: 'layout9l.jpg',
    imageUrlRight: 'layout9r.jpg',
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 1',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 10,
    imageUrlLeft: 'layout10l.jpg',
    imageUrlRight: 'layout10r.jpg',
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro page 1',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 11,
    imageUrlLeft: 'layout11l.jpg',
    imageUrlRight: 'layout11r.jpg',
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Club 7',
    isFavorites: false,
    themeId: 7
  },
  {
    id: 12,
    imageUrlLeft: 'layout12l.jpg',
    imageUrlRight: 'layout12r.jpg',
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple  3',
    isFavorites: false,
    themeId: 3
  },
  {
    id: 13,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  2',
    isFavorites: false,
    themeId: 2
  },
  {
    id: 14,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  4',
    isFavorites: false,
    themeId: 4
  },
  {
    id: 15,
    imageUrlLeft: 'layout15l.jpg',
    imageUrlRight: 'layout15r.jpg',
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award 5',
    isFavorites: false,
    themeId: 3
  },
  {
    id: 16,
    imageUrlLeft: 'layout12l.jpg',
    imageUrlRight: 'layout12r.jpg',
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 12',
    isFavorites: false,
    themeId: 2
  },
  {
    id: 17,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 4',
    isFavorites: false,
    themeId: 4
  },
  {
    id: 18,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    themeId: 8
  },
  {
    id: 19,
    imageUrlLeft: 'layout4l.jpg',
    imageUrlRight: 'layout4r.jpg',
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 9',
    isFavorites: false,
    themeId: 8
  },
  {
    id: 20,
    imageUrlLeft: 'layout2l.jpg',
    imageUrlRight: 'layout2r.jpg',
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro 2',
    isFavorites: false,
    themeId: 2
  },
  {
    id: 21,
    imageUrlLeft: 'layout2l.jpg',
    imageUrlRight: 'layout2r.jpg',
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 4',
    isFavorites: false,
    themeId: 4
  },
  {
    id: 22,
    imageUrlLeft: 'layout1l.jpg',
    imageUrlRight: 'layout1r.jpg',
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 5',
    isFavorites: false,
    themeId: 5
  },
  {
    id: 23,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 6',
    isFavorites: false,
    themeId: 6
  },
  {
    id: 24,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature 6',
    isFavorites: false,
    themeId: 6
  },
  {
    id: 25,
    imageUrlLeft: 'layout15l.jpg',
    imageUrlRight: 'layout15r.jpg',
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    themeId: 9
  },
  {
    id: 26,
    imageUrlLeft: 'layout12l.jpg',
    imageUrlRight: 'layout12r.jpg',
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 10',
    isFavorites: false,
    themeId: 10
  },
  {
    id: 27,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 11',
    isFavorites: false,
    themeId: 11
  },
  {
    id: 28,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards 10',
    isFavorites: false,
    themeId: 10
  },
  {
    id: 29,
    imageUrlLeft: 'layout4l.jpg',
    imageUrlRight: 'layout4r.jpg',
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    themeId: 9
  },
  {
    id: 30,
    imageUrlLeft: 'layout2l.jpg',
    imageUrlRight: 'layout2r.jpg',
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Year 9',
    isFavorites: false,
    themeId: 6
  },
  {
    id: 31,
    imageUrlLeft: 'layout2l.jpg',
    imageUrlRight: 'layout2r.jpg',
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 9',
    isFavorites: false,
    themeId: 9
  },
  {
    id: 32,
    imageUrlLeft: 'layout1l.jpg',
    imageUrlRight: 'layout1r.jpg',
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 6',
    isFavorites: false,
    themeId: 6
  },
  {
    id: 33,
    imageUrlLeft: 'layout1l.jpg',
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    name: 'Single 6',
    isFavorites: false,
    themeId: 6
  },
  {
    id: 34,
    imageUrlLeft: 'layout1l.jpg',
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    name: 'Single 7',
    isFavorites: false,
    themeId: 6
  },
  {
    id: 35,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    themeId: 1
  },

  {
    id: 36,
    imageUrlLeft: 'layout1l.jpg',
    imageUrlRight: 'layout1r.jpg',
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 36',
    isFavorites: false,
    themeId: 1
  },
  {
    id: 37,
    imageUrlLeft: 'layout14l.jpg',
    imageUrlRight: 'layout14r.jpg',
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    themeId: 1
  },

  {
    id: 38,
    imageUrlLeft: 'layout1l.jpg',
    imageUrlRight: 'layout1r.jpg',
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    name: 'Collage 36',
    isFavorites: false,
    themeId: 1
  }
];

module.exports = layouts;
