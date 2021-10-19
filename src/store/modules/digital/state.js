import { merge, cloneDeep } from 'lodash';

import { editionDefaultState } from '@/common/store';

const digitalState = {
  frameIds: [],
  frames: {},
  triggerChange: {
    background: true,
    applyLayout: true,
    transition: true,
    animation: true
  },
  storeAnimationProp: {},
  playInIds: [],
  playOutIds: []
};

export const state = merge(cloneDeep(editionDefaultState), digitalState);
