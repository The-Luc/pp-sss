import { ClipArtElement } from '@/common/models/elements';

export const CLIP_ART_CATEGORIES = [
  {
    id: 0,
    name: 'Aducation'
  },
  {
    id: 1,
    name: 'Education Icons'
  },
  {
    id: 2,
    name: 'Design Elements'
  }
];

const mockClipArts = [
  {
    id: 3139,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3139/set2-35.png?2021',
    vector: 'clip-art-1.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3139/set2-35_large.png',
    isColorful: true
  },
  {
    id: 3138,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3138/set2-34.png?2021',
    vector: 'clip-art-2.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3138/set2-34_large.png',
    isColorful: true
  },
  {
    id: 3137,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3137/set2-33.png?2021',
    vector: 'clip-art-3.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3137/set2-33_large.png',
    isColorful: true
  },
  {
    id: 3136,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3136/set2-32.png?2021',
    vector: 'clip-art-4.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3136/set2-32_large.png',
    isColorful: true
  },
  {
    id: 3135,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3135/set2-30.png?2021',
    vector: 'clip-art-5.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3135/set2-30_large.png',
    isColorful: true
  },
  {
    id: 3134,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3134/set2-29.png?2021',
    vector: 'clip-art-6.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3134/set2-29_large.png',
    isColorful: true
  },
  {
    id: 3133,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3133/set2-26.png?2021',
    vector: 'clip-art-7.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3133/set2-26_large.png',
    isColorful: true
  },
  {
    id: 3132,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3132/set2-24.png?2021',
    vector: 'clip-art-8.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3132/set2-24_large.png',
    isColorful: true
  },
  {
    id: 3131,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3131/set2-23.png?2021',
    vector: 'clip-art-9.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3131/set2-23_large.png',
    isColorful: true
  },
  {
    id: 3130,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3130/set2-21.png?2021',
    vector: 'clip-art-10.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3130/set2-21_large.png',
    isColorful: true
  },
  {
    id: 3129,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3129/set2-20.png?2021',
    vector: 'clip-art-11.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3129/set2-20_large.png',
    isColorful: false,
    color: '#ae0210'
  },
  {
    id: 3128,
    name: 'education',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3128/set2-19.png?2021',
    vector: 'clip-art-12.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3128/set2-19_large.png',
    isColorful: true
  },
  {
    id: 3127,
    name: 'education',
    category: 2,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3127/set2-16.png?2021',
    vector: 'clip-art-13.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3127/set2-16_large.png',
    isColorful: false,
    color: '#808080'
  },
  {
    id: 3126,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3126/set2-18.png?2021',
    vector: 'clip-art-14.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3126/set2-18_large.png',
    isColorful: true
  },
  {
    id: 3125,
    name: 'education',
    category: 2,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3125/set2-13.png?2021',
    vector: 'clip-art-15.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3125/set2-13_large.png',
    isColorful: true
  },
  {
    id: 3124,
    name: 'education',
    category: 2,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3124/set2-10.png?2021',
    vector: 'clip-art-16.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3124/set2-10_large.png',
    isColorful: true
  },
  {
    id: 3123,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3123/set2-06.png?2021',
    vector: 'clip-art-17.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3123/set2-06_large.png',
    isColorful: true
  },
  {
    id: 3122,
    name: 'education',
    category: 2,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3122/set2-05.png?2021',
    vector: 'clip-art-18.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3122/set2-05_large.png',
    isColorful: true
  },
  {
    id: 3121,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3121/set2-04.png?2021',
    vector: 'clip-art-19.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3121/set2-04_large.png',
    isColorful: true
  },
  {
    id: 3120,
    name: 'education',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3120/set2-03.png?2021',
    vector: 'clip-art-20.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3120/set2-03_large.png',
    isColorful: true
  },
  {
    id: 3119,
    name: 'education',
    category: 0,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3119/set2-02.png?2021',
    vector: 'clip-art-21.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3119/set2-02_large.png',
    isColorful: true
  },
  {
    id: 3118,
    name: 'education icons',
    category: 2,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3118/set_1_again-17.png?2021',
    vector: 'clip-art-22.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3118/set_1_again-17_large.png',
    isColorful: true
  },
  {
    id: 3117,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3117/set_1_again-16.png?2021',
    vector: 'clip-art-23.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3117/set_1_again-16_large.png',
    isColorful: true
  },
  {
    id: 3116,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3116/set_1_again-15.png?2021',
    vector: 'clip-art-24.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3116/set_1_again-15_large.png',
    isColorful: true
  },
  {
    id: 3114,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3114/set_1_again-13.png?2021',
    vector: 'clip-art-25.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3114/set_1_again-13_large.png',
    isColorful: true
  },
  {
    id: 3113,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3113/set_1_again-12.png?2021',
    vector: 'clip-art-26.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3113/set_1_again-12_large.png',
    isColorful: true
  },
  {
    id: 3112,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3112/set_1_again-11.png?2021',
    vector: 'clip-art-27.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3112/set_1_again-11_large.png',
    isColorful: true
  },
  {
    id: 3111,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3111/set_1_again-10.png?2021',
    vector: 'clip-art-28.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3111/set_1_again-10_large.png',
    isColorful: true
  },
  {
    id: 3110,
    name: 'education icons',
    category: 2,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3110/set_1_again-09.png?2021',
    vector: 'clip-art-29.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3110/set_1_again-09_large.png',
    isColorful: true
  },
  {
    id: 3108,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3108/set_1_again-07.png?2021',
    vector: 'clip-art-32.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3108/set_1_again-07_large.png',
    isColorful: true
  },
  {
    id: 3107,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3107/set_1_again-06.png?2021',
    vector: 'clip-art-33.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3107/set_1_again-06_large.png',
    isColorful: true
  },
  {
    id: 3106,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3106/set_1_again-05.png?2021',
    vector: 'clip-art-34.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3106/set_1_again-05_large.png',
    isColorful: true
  },
  {
    id: 3105,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3105/set_1_again-04.png?2021',
    vector: 'clip-art-35.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3105/set_1_again-04_large.png',
    isColorful: true
  },
  {
    id: 3104,
    name: 'education icons',
    category: 1,
    thumbnail:
      'http://s3.amazonaws.com/fms.prod/yb_clipart/global/3104/set_1_again-03.png?2021',
    vector: 'clip-art-36.svg',
    large:
      'https://s3.amazonaws.com/fms.prod/yb_clipart/global/3104/set_1_again-03_large.png',
    isColorful: true
  }
];

const mappedClipArts = mockClipArts.map(c => ({
  ...ClipArtElement,
  ...c
}));

export default mappedClipArts;
