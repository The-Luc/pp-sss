import { LAYOUT_TYPES } from '@/common/constants/layoutTypes';
import {
  TextElement,
  BackgroundElement,
  ClipArtElement,
  ShapeElement
} from './elements';

const text1 = {
  ...TextElement,
  id: 'text-1',
  size: {
    width: 100,
    height: 50
  },
  coord: {
    x: 500,
    y: 250,
    rotation: 20 // degree
  },
  property: {
    styleId: 'default',
    text: 'Sample Text',
    fontFamily: 'Arial',
    fontSize: 20,
    isBold: true,
    isItalic: true,
    isUnderline: false,
    color: '#FF0000'
  }
};

const text2 = {
  ...TextElement,
  id: 'text-2',
  size: {
    width: 200,
    height: 100
  },
  coord: {
    x: 500,
    y: 50,
    rotation: 0 // degree
  },
  property: {
    styleId: 'default',
    text: 'Header Text',
    fontFamily: 'Arial',
    fontSize: 20,
    isBold: true,
    isItalic: true,
    isUnderline: false,
    color: '#FF0000'
  }
};

const bg1 = {
  ...BackgroundElement,
  id: 'bg-1',
  size: {
    width: 0,
    height: 0
  },
  coord: {
    x: 0,
    y: 0,
    rotation: 0 // degree
  },
  property: {
    category: 'Cover',
    name: 'watercolorbackground.jpg',
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/700/original_watercolorbackground.jpg',
    imageUrl:
      'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/700/original_watercolorbackground.jpg'
  }
};

const bg2 = {
  ...BackgroundElement,
  id: 'bg-2',
  size: {
    width: 0,
    height: 0
  },
  coord: {
    x: 0,
    y: 0,
    rotation: 0 // degree
  },
  property: {
    category: 'Cover',
    name: 'watercolorbackground.jpg',
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/233/original_papertree.jpg',
    imageUrl:
      'http://s3.amazonaws.com/fms.prod/yb_backgrounds/global/233/original_papertree.jpg'
  }
};

const clipArt1 = {
  ...ClipArtElement,
  id: 'clip-art-1',
  size: {
    width: 100,
    height: 100
  },
  coord: {
    x: 500,
    y: 250,
    rotation: 0 // degree
  },
  property: {
    category: 'MSPHOTO',
    name: 'LPCA_04531',
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/1725/LPCA_04531.png?2013',
    vector:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/1725/LPCA_04531.svg?2013', // imgUrl
    fillcolor: '',
    opacity: 0
  }
};

const clipArt2 = {
  ...ClipArtElement,
  id: 'clip-art-2',
  size: {
    width: 100,
    height: 100
  },
  coord: {
    x: 230,
    y: 250,
    rotation: 0 // degree
  },
  property: {
    category: 'MSPHOTO',
    name: 'LPCA_04511',
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/1715/LPCA_04511.png?2013',
    vector:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/1715/LPCA_04511.svg?2013' // imgUrl
  }
};

const shape1 = {
  ...ShapeElement,
  id: 'shape-1',
  size: {
    width: 100,
    height: 100
  },
  coord: {
    x: 100,
    y: 206,
    rotation: 0 // degree
  },
  property: {
    category: '',
    name: '',
    thumbnail: '',
    pathData: 'img.svg' // TODO: Need discuss with FM to get instruction on using shape
  }
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
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, clipArt1, bg1]
      },
      {
        objects: [text2, clipArt2, bg2, shape1]
      }
    ]
  },
  {
    id: 2,
    type: LAYOUT_TYPES.COVER.value,
    name: 'Cover 2',
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    isFavorites: false,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ]
  },
  {
    id: 3,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Collage 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ]
  },
  {
    id: 4,
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin & staff',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ]
  },
  {
    id: 5,
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Clubs, Group',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards Superlative',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.ADMIN_STAFF.value,
    name: 'Admin Staff 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro page 1',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.CLUBS_GROUPS_TEAMS.value,
    name: 'Club 7',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple  3',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  2',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award  4',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Award 5',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 12',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.GRADUATION.value,
    name: 'Graduation 4',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.INTRO_OPENING_PAGE.value,
    name: 'Intro 2',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 4',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 5',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIGNATURES.value,
    name: 'Signature 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 10',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 11',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.AWARDS_SUPERLATIVE.value,
    name: 'Awards 10',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.YEAR_IN_REVIEW.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Year 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.SIMPLE.value,
    name: 'Simple 9',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
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
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      }
    ],
    name: 'Single 6',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 6
  },
  {
    id: 34,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      }
    ],
    name: 'Single 7',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
    type: LAYOUT_TYPES.COLLAGE.value,
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
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
        objects: [text1, bg1]
      },
      {
        objects: [text2, bg2]
      }
    ],
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
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      }
    ],
    name: 'Collage 8',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  },

  {
    id: 38,
    type: LAYOUT_TYPES.SINGLE_PAGE.value,
    size: {
      width: 1000,
      height: 500
    },
    pages: [
      {
        objects: [text1, bg1]
      }
    ],
    name: 'Collage 36',
    isFavorites: false,
    previewImageUrl:
      'https://fms-stage.s3.amazonaws.com/templates/2334/ea90833e672078265455a76fb437f9a5139a81b8.jpg?1619013144',
    themeId: 1
  }
];

export default layouts;
