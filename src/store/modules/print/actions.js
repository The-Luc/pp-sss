import { uniqueId } from 'lodash';

import { isEmpty, isHalfSheet } from '@/common/utils';
import printService from '@/api/print';
import { setPrintPpLayouts } from '@/api/layouts';

import {
  STATUS,
  OBJECT_TYPE,
  SHEET_TYPE,
  LINK_STATUS,
  MODAL_TYPES,
  LAYOUT_PAGE_TYPE
} from '@/common/constants';

import PRINT from './const';
import { MUTATES as APP_MUTATES } from '../app/const';

export const actions = {
  async [PRINT._ACTIONS.GET_DATA_MAIN]({ state, commit }) {
    const queryResult = await printService.getPrintSectionsSheets(
      state.book.id
    );

    if (queryResult.status !== STATUS.OK) return;

    commit(PRINT._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: queryResult.data
    });
  },
  async [PRINT._ACTIONS.GET_DATA_EDIT]({ state, commit }) {
    const queryResults = await Promise.all([
      printService.getDefaultThemeId(state.book.id),
      printService.getPrintEditSectionsSheets(state.book.id),
      printService.getPageInfo(state.book.id)
    ]);

    if (queryResults[1].status !== STATUS.OK) return;

    commit(PRINT._MUTATES.SET_DEFAULT_THEME_ID, {
      themeId: queryResults[0].data
    });

    commit(PRINT._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: queryResults[1].data
    });

    commit(PRINT._MUTATES.SET_PAGE_INFO, {
      pageInfo: queryResults[2].data
    });
  },
  async [PRINT._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    // reset the store
    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: [] });
    commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: {} });

    const queryObjectResult = await printService.getSheetObjects(
      state.book.id,
      state.sheets[state.currentSheetId].sectionId,
      state.currentSheetId
    );

    if (isEmpty(queryObjectResult.data)) return;

    const data = queryObjectResult.data;

    const backgrounds = data.filter(o => o.type === OBJECT_TYPE.BACKGROUND);
    const objects = data.filter(o => o.type !== OBJECT_TYPE.BACKGROUND);

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: objects });

    backgrounds.forEach(bg =>
      commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: bg })
    );
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
      if (layout.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id) {
        commit(PRINT._MUTATES.CLEAR_BACKGROUNDS);
      } else {
        commit(PRINT._MUTATES.CLEAR_BACKGROUNDS, currentPosition);
      }
    }

    if (backgroundObjs.length === 2) {
      backgroundObjs.forEach(bg => {
        commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: bg });
      });
    }

    if (backgroundObjs.length === 1) {
      backgroundObjs[0].isLeftPage = currentPosition === 'left';
      commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: backgroundObjs[0] });
    }

    // Get object(s) rest
    const restObjs = layout.objects.filter(
      obj => obj.type !== OBJECT_TYPE.BACKGROUND
    );
    let objectList = restObjs.map(obj => ({
      ...obj,
      position: currentPosition,
      id: uniqueId(`${obj.id}`)
    }));

    if (pagePosition) {
      let storeObjects = Object.values(state.objects).filter(
        item => !isEmpty(item)
      );

      if (pagePosition === 'right') {
        storeObjects = Object.values(state.objects).filter(
          item => !isEmpty(item) && item.coord.x < positionCenterX
        );
      }
      if (pagePosition === 'left') {
        storeObjects = Object.values(state.objects).filter(
          item => !isEmpty(item) && item.coord.x >= positionCenterX
        );
      }
      objectList = [...objectList, ...storeObjects];
    }

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList });

    // Update sheet fields
    commit(PRINT._MUTATES.SET_SHEET_DATA, {
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });
  },
  [PRINT._ACTIONS.UPDATE_SHEET_LINK_STATUS]({ commit }, { link, sheetId }) {
    const statusLink =
      link === LINK_STATUS.LINK ? LINK_STATUS.UNLINK : LINK_STATUS.LINK;
    commit(PRINT._MUTATES.SET_SHEET_LINK_STATUS, { statusLink, sheetId });
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
