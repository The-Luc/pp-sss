export const IMAGE_BORDER_TYPE = {
  SINGLE: 'single',
  DOUBLE: 'double',
  DOTTED: 'round',
  DASHED: 'square'
};

import IMAGE_STYLE_01 from '@/assets/image/image-style/image-style-01.svg';
import IMAGE_STYLE_02 from '@/assets/image/image-style/image-style-02.svg';
import IMAGE_STYLE_03 from '@/assets/image/image-style/image-style-03.svg';
import IMAGE_STYLE_04 from '@/assets/image/image-style/image-style-04.svg';
import IMAGE_STYLE_05 from '@/assets/image/image-style/image-style-05.svg';
import IMAGE_STYLE_06 from '@/assets/image/image-style/image-style-06.svg';
import IMAGE_STYLE_07 from '@/assets/image/image-style/image-style-07.svg';
import IMAGE_STYLE_08 from '@/assets/image/image-style/image-style-08.svg';
import IMAGE_STYLE_09 from '@/assets/image/image-style/image-style-09.svg';
import IMAGE_STYLE_10 from '@/assets/image/image-style/image-style-10.svg';
import IMAGE_STYLE_11 from '@/assets/image/image-style/image-style-11.svg';
import IMAGE_STYLE_12 from '@/assets/image/image-style/image-style-12.svg';
import { DEFAULT_BORDER, DEFAULT_SHADOW } from '@/common/constants';
import { cloneDeep } from 'lodash';

const defaultBorder = {
  showBorder: DEFAULT_BORDER.SHOW_BORDER,
  stroke: DEFAULT_BORDER.STROKE,
  strokeWidth: DEFAULT_BORDER.STROKE_WIDTH,
  strokeDashArray: DEFAULT_BORDER.STROKE_DASH_ARRAY,
  strokeLineType: IMAGE_BORDER_TYPE.SINGLE
};

const defaultShadow = {
  dropShadow: DEFAULT_SHADOW.DROP_SHADOW,
  shadowBlur: DEFAULT_SHADOW.BLUR,
  shadowOffset: DEFAULT_SHADOW.OFFSET,
  shadowOpacity: DEFAULT_SHADOW.OPACITY,
  shadowAngle: DEFAULT_SHADOW.ANGLE,
  shadowColor: DEFAULT_SHADOW.COLOR
};

export const IMAGE_STYLE = [
  {
    id: 1,
    className: 'image-style-01',
    imageUrl: IMAGE_STYLE_01,
    style: {
      border: cloneDeep(defaultBorder),
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 2,
    className: 'image-style-02',
    imageUrl: IMAGE_STYLE_02,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#FFFFFF',
        strokeWidth: 2
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 3,
    classname: 'Single Line',
    imageUrl: IMAGE_STYLE_03,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#FFFFFF',
        strokeWidth: 6
      },
      shadow: {
        ...cloneDeep(defaultShadow),
        dropShadow: true
      }
    }
  },
  {
    id: 4,
    className: 'image-style-04',
    imageUrl: IMAGE_STYLE_04,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#000000',
        strokeWidth: 20
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 5,
    className: 'image-style-05',
    imageUrl: IMAGE_STYLE_05,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#000000',
        strokeWidth: 6
      },
      shadow: {
        ...cloneDeep(defaultShadow),
        dropShadow: true
      }
    }
  },
  {
    id: 6,
    className: 'image-style-06',
    imageUrl: IMAGE_STYLE_06,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#000000',
        strokeWidth: 10,
        strokeLineType: IMAGE_BORDER_TYPE.DOUBLE
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 7,
    className: 'image-style-07',
    imageUrl: IMAGE_STYLE_07,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#000000',
        strokeWidth: 10,
        strokeLineType: IMAGE_BORDER_TYPE.DASHED
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 8,
    className: 'image-style-08',
    imageUrl: IMAGE_STYLE_08,

    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#000000',
        strokeWidth: 10,
        strokeLineType: IMAGE_BORDER_TYPE.DOTTED
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 9,
    className: 'image-style-09',
    imageUrl: IMAGE_STYLE_09,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#454545',
        strokeWidth: 4
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 10,
    className: 'image-style-10',
    imageUrl: IMAGE_STYLE_10,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#0A4698',
        strokeWidth: 40
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 11,
    className: 'image-style-11',
    imageUrl: IMAGE_STYLE_11,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#841B1B',
        strokeWidth: 40
      },
      shadow: cloneDeep(defaultShadow)
    }
  },
  {
    id: 12,
    className: 'image-style-12',
    imageUrl: IMAGE_STYLE_12,
    style: {
      border: {
        ...cloneDeep(defaultBorder),
        showBorder: true,
        stroke: '#D3CFA5',
        strokeWidth: 40
      },
      shadow: cloneDeep(defaultShadow)
    }
  }
];
