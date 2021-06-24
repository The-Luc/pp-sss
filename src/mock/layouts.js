import { uniqueId } from 'lodash';

import { LAYOUT_TYPES } from '@/common/constants/layoutTypes';
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
import LPCA_04531 from '@/assets/image/layouts/background/LPCA_04531.png';
import LPCA_04511 from '@/assets/image/layouts/background/LPCA_04511.png';
import BG_SINGLE_PAGE_1 from '@/assets/image/layouts/background/bg-single-page-01.jpg';
import BG_SINGLE_PAGE_2 from '@/assets/image/layouts/background/bg-single-page-02.jpg';

const text1 = {
  ...TextElement,
  id: uniqueId(),
  size: {
    width: 100,
    height: 50
  },
  coord: {
    x: 250,
    y: 250,
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
    width: 200,
    height: 100
  },
  coord: {
    x: 250,
    y: 250,
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
  thumbnail: BG_1,
  imageUrl: BG_1
};

const bg2 = {
  ...BackgroundElement,
  id: uniqueId(),
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
  thumbnail: BG_2,
  imageUrl: BG_2
};

const clipArt1 = {
  ...ClipArtElement,
  id: uniqueId(),
  size: {
    width: 100,
    height: 100
  },
  coord: {
    x: 500,
    y: 250,
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
    width: 100,
    height: 100
  },
  coord: {
    x: 230,
    y: 250,
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
    width: 100,
    height: 100
  },
  coord: {
    x: 100,
    y: 206,
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
    width: 500,
    height: 176.6071428571429
  },
  coord: {
    x: 500,
    y: 193.3333333333333,
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
    width: 500,
    height: 176.6071428571429
  },
  coord: {
    x: 500,
    y: 193.3333333333333,
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
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1, clipArt1]
      },
      {
        objects: [bg2, text2, clipArt2, shape1]
      }
    ]
  },
  {
    id: 2,
    type: LAYOUT_TYPES.COVER.value,
    name: 'Cover 2',
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    isFavorites: false,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ]
  },
  {
    id: 3,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Collage 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ]
  },
  {
    id: 4,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin & staff',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ]
  },
  {
    id: 5,
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Clubs, Group',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ]
  },
  {
    id: 6,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1
  },
  {
    id: 7,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards Superlative',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1
  },
  {
    id: 8,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin Staff 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1
  },
  {
    id: 9,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1
  },
  {
    id: 10,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro page 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1
  },
  {
    id: 11,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Club 7',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 7
  },
  {
    id: 12,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple  3',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 3
  },
  {
    id: 13,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  2',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 2
  },
  {
    id: 14,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  4',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 4
  },
  {
    id: 15,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award 5',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 3
  },
  {
    id: 16,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 12',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 2
  },
  {
    id: 17,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 4',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 4
  },
  {
    id: 18,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 8
  },
  {
    id: 19,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 8
  },
  {
    id: 20,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro 2',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 2
  },
  {
    id: 21,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 4',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 4
  },
  {
    id: 22,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 5',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 5
  },
  {
    id: 23,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6
  },
  {
    id: 24,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6
  },
  {
    id: 25,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 9
  },
  {
    id: 26,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 10',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 10
  },
  {
    id: 27,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 11',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 11
  },
  {
    id: 28,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards 10',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 10
  },
  {
    id: 29,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 9
  },
  {
    id: 30,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6
  },
  {
    id: 31,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 9',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 9
  },
  {
    id: 32,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6
  },
  {
    id: 33,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      }
    ],
    name: 'Single 6',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 6
  },
  {
    id: 34,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    size: {
      width: 2625,
      height: 3375
    },
    pages: [
      {
        objects: [bg1, text1]
      }
    ],
    name: 'Single 7',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 6
  },
  {
    id: 35,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1
  },

  {
    id: 36,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bg1, text1]
      },
      {
        objects: [bg2, text2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 36',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1
  },
  {
    id: 37,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [bgSinglePage1, textSinglePage1]
      }
    ],
    name: 'Single 1',
    isFavorites: false,
    previewImageUrl: LAYOUT_01,
    themeId: 1
  },

  {
    id: 38,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    size: {
      width: 2625,
      height: 3375
    },
    pages: [
      {
        objects: [bgSinglePage2, textSinglePage2]
      }
    ],
    name: 'Single 2',
    isFavorites: false,
    previewImageUrl: LAYOUT_02,
    themeId: 1
  }
];

export default layouts;
