import { isEmpty } from '@/common/utils';

import PRINT from './const';

export const getters = {
  [PRINT._GETTERS.CURRENT_SHEET]: ({ sheets, currentSheetId }) => {
    return sheets[currentSheetId];
  },
  [PRINT._GETTERS.BACKGROUNDS]: ({ background }) => {
    return [background.left, background.right].filter(bg => {
      return !isEmpty(bg);
    });
  }
};
