import { merge, cloneDeep } from 'lodash';

import { editionDefaultState } from '@/common/store';
import { COVER_TYPE } from '@/common/constants';

const printState = {
  book: {
    coverOption: COVER_TYPE.HARDCOVER,
    numberMaxPages: 0,
    pageInfo: {}
  }
};

export const state = merge(cloneDeep(editionDefaultState), printState);
