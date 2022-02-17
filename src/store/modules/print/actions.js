import { cloneDeep } from 'lodash';

import { getSheetInfoApi } from '@/api/sheet';
import { getNewBackground } from '@/common/models';
import { getUniqueId, isEmpty, entitiesToObjects } from '@/common/utils';

import PRINT from './const';

import { OBJECT_TYPE, SHEET_TYPE, LAYOUT_PAGE_TYPE } from '@/common/constants';

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
  },
  [PRINT._ACTIONS.UPDATE_SHEET_THEME_LAYOUT](
    { state, commit },
    { themeId, layout, pagePosition, positionCenterX }
  ) {
    const currentSheet = state.sheets[state.currentSheetId];

    const objects = entitiesToObjects(layout.objects);
    objects.forEach(o => {
      if (o?.coord?.x > 1000) {
        o.coord.x = o.coord.x - 2625 + 8.625;
      }
    });

    // Check whether user has add single page or not.
    //Value: left or right with single page else undefine
    const isFullLayout = layout.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id;

    // Front cover always has the right page
    // Back cover always has the left page
    const currentPosition =
      currentSheet.type === SHEET_TYPE.FRONT_COVER
        ? 'right'
        : currentSheet.type === SHEET_TYPE.BACK_COVER
        ? 'left'
        : pagePosition;

    const isLeftPage = currentPosition === 'left';
    const isRightPage = currentPosition === 'right';

    // Get background object
    const backgroundObjs = objects.filter(
      obj => obj.type === OBJECT_TYPE.BACKGROUND
    );

    if (backgroundObjs.length === 0) {
      const selectedPosition = isFullLayout ? '' : currentPosition;

      commit(PRINT._MUTATES.CLEAR_BACKGROUNDS, selectedPosition);
    }

    if (backgroundObjs.length === 2) {
      backgroundObjs.forEach(bg => {
        commit(PRINT._MUTATES.SET_BACKGROUND, { background: bg });
      });
    }

    if (backgroundObjs.length === 1) {
      isFullLayout && commit(PRINT._MUTATES.CLEAR_BACKGROUNDS);

      backgroundObjs[0].isLeftPage = isFullLayout || isLeftPage;
      commit(PRINT._MUTATES.SET_BACKGROUND, { background: backgroundObjs[0] });
    }

    if (isFullLayout) {
      const objectList = objects.map(obj => ({
        ...obj,
        id: getUniqueId()
      }));

      commit(PRINT._MUTATES.SET_OBJECTS, { objectList });
      return;
    }

    // Get object(s) rest
    const restObjs = objects.filter(obj => obj.type !== OBJECT_TYPE.BACKGROUND);
    const newObjects = restObjs.map(obj => ({
      ...obj,
      position: currentPosition,
      id: getUniqueId()
    }));

    const storeObjects = Object.values(cloneDeep(state.objects)).filter(obj => {
      if (isEmpty(obj)) return false;

      const x = obj.coord.x;

      const isKeepLeft = isRightPage && x < positionCenterX;
      const isKeepRight = isLeftPage && x >= positionCenterX;

      return isKeepLeft || isKeepRight;
    });

    const objectList = [...newObjects, ...storeObjects];

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList });

    // Update sheet fields
    commit(PRINT._MUTATES.SET_SHEET_DATA, {
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });
  }
};
