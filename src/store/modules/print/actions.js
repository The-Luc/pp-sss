import { getSheetInfoApi } from '@/api/sheet';
import { getNewBackground } from '@/common/models';
import { isEmpty } from '@/common/utils';

import PRINT from './const';

import { OBJECT_TYPE } from '@/common/constants';

export const actions = {
  async [PRINT._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    // reset the store
    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: [] });
    commit(PRINT._MUTATES.SET_BACKGROUNDS, { backgrounds: getNewBackground() });

    const { objects: data } = await getSheetInfoApi(state.currentSheetId);

    if (isEmpty(data)) return;

    const backgrounds = data.filter(o => o.type === OBJECT_TYPE.BACKGROUND);
    const objects = data.filter(o => o.type !== OBJECT_TYPE.BACKGROUND);

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: objects });

    const firstBg = backgrounds[0];
    const secondBg = backgrounds[1];
    const hasSecondBg = secondBg ? secondBg : {};

    const leftBackground = firstBg?.isLeftPage ? firstBg : {};
    const rightBackground =
      firstBg && !firstBg.isLeftPage ? firstBg : hasSecondBg;

    commit(PRINT._MUTATES.SET_BACKGROUNDS, {
      backgrounds: {
        left: leftBackground,
        right: rightBackground
      }
    });
  }
};
