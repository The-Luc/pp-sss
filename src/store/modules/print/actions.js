import { cloneDeep } from 'lodash';

import { getSheetInfo } from '@/api/sheet';

import printService from '@/api/print';
import { setPrintPpLayouts } from '@/api/layoutService';

import { getNewBackground } from '@/common/models';

import { getUniqueId, isEmpty } from '@/common/utils';

import { MUTATES as APP_MUTATES } from '../app/const';

import PRINT from './const';

import {
  OBJECT_TYPE,
  SHEET_TYPE,
  MODAL_TYPES,
  LAYOUT_PAGE_TYPE
} from '@/common/constants';

export const actions = {
  async [PRINT._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    // reset the store
    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: [] });
    commit(PRINT._MUTATES.SET_BACKGROUNDS, { backgrounds: getNewBackground() });

    const { objects: data, media } = await getSheetInfo(state.currentSheetId);

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
    commit(PRINT._MUTATES.SET_SHEET_MEDIA, { media });
  },
  [PRINT._ACTIONS.UPDATE_SHEET_THEME_LAYOUT](
    { state, commit },
    { themeId, layout, pagePosition, positionCenterX }
  ) {
    const currentSheet = state.sheets[state.currentSheetId];
    let currentPosition = pagePosition; // Check whether user has add single page or not. Value: left or right with single page else undefine
    // Get background object
    const backgroundObjs = layout.objects.filter(
      obj => obj.type === OBJECT_TYPE.BACKGROUND
    );

    if (currentSheet.type === SHEET_TYPE.FRONT_COVER) {
      // Front cover always has the right page
      currentPosition = 'right';
    }

    if (currentSheet.type === SHEET_TYPE.BACK_COVER) {
      // Back cover always has the left page
      currentPosition = 'left';
    }

    if (backgroundObjs.length === 0) {
      const selectedPosition =
        layout.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id
          ? ''
          : currentPosition;

      commit(PRINT._MUTATES.CLEAR_BACKGROUNDS, selectedPosition);
    }

    if (backgroundObjs.length === 2) {
      backgroundObjs.forEach(bg => {
        commit(PRINT._MUTATES.SET_BACKGROUND, { background: bg });
      });
    }

    if (backgroundObjs.length === 1) {
      backgroundObjs[0].isLeftPage = currentPosition === 'left';
      commit(PRINT._MUTATES.SET_BACKGROUND, { background: backgroundObjs[0] });
    }

    // Get object(s) rest
    const restObjs = layout.objects.filter(
      obj => obj.type !== OBJECT_TYPE.BACKGROUND
    );
    const newObjects = restObjs.map(obj => ({
      ...obj,
      position: currentPosition,
      id: getUniqueId()
    }));

    const isLeftPage = pagePosition === 'left';
    const isRightPage = pagePosition === 'right';

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
  },
  async [PRINT._ACTIONS.UPDATE_SHEET_LINK_STATUS](
    { commit },
    { link, sheetId }
  ) {
    await printService.saveSheetLinkStatus(sheetId, link);
    await printService.saveSpreadInfo(sheetId, {
      leftTitle: '',
      rightTitle: ''
    });
    commit(PRINT._MUTATES.SET_SHEET_LINK_STATUS, { link, sheetId });
  },
  async [PRINT._ACTIONS.SAVE_LAYOUT]({ commit }, { layout }) {
    await setPrintPpLayouts(layout);
    commit(
      APP_MUTATES.TOGGLE_MODAL,
      {
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_LAYOUT_SUCCESS
        }
      },
      { root: true }
    );
  }
};
