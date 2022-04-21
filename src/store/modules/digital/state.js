import { merge, cloneDeep } from 'lodash';

import { editionDefaultState } from '@/common/store';

const digitalState = {
  frameIds: [],
  frames: {},
  currentFrameId: null,
  triggerChange: {
    background: true,
    applyLayout: true,
    transition: true,
    animation: true
  },
  playInIds: [],
  playOutIds: []
};

export const state = merge(cloneDeep(editionDefaultState), digitalState);
