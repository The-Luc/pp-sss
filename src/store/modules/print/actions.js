import { uniqueId } from 'lodash';

import { isEmpty, isHalfSheet } from '@/common/utils';
import printService from '@/api/print';
import { setPrintPpLayouts } from '@/api/layouts';

import {
  STATUS,
  OBJECT_TYPE,
  SHEET_TYPE,
  LINK_STATUS,
  MODAL_TYPES
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
    { themeId, layout, pagePosition }
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

    if (backgroundObjs.length === 2) {
      backgroundObjs.forEach(bg => {
        commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: bg });
      });
    }

    if (backgroundObjs.length === 1) {
      backgroundObjs[0].isLeftPage = currentPosition === 'left';
      const emptyBackgroundPosition =
        currentPosition === 'left' ? 'right' : 'left';
      commit(PRINT._MUTATES.CLEAR_BACKGROUNDS, emptyBackgroundPosition);
      commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: backgroundObjs[0] });
    }

    // Get object(s) rest
    const restObjs = layout.objects.filter(
      obj => obj.type !== OBJECT_TYPE.BACKGROUND
    );
    const objectList = restObjs.map(obj => ({
      ...obj,
      position: currentPosition,
      id: uniqueId(`${obj.id}`)
    }));

    // Remove objects when user override layout
    if (currentPosition && !isHalfSheet(currentSheet)) {
      commit(PRINT._MUTATES.REMOVE_OBJECTS, { currentPosition });
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
    printService.saveSheetLinkStatus(sheetId, statusLink);
    commit(PRINT._MUTATES.SET_SHEET_LINK_STATUS, { statusLink, sheetId });
  },

  [PRINT._ACTIONS.SAVE_DEFAULT_THEME_ID]({ commit }, { themeId }) {
    printService.saveDefaultThemeId(themeId);
    commit(PRINT._MUTATES.SET_DEFAULT_THEME_ID, { themeId });
  },

  [PRINT._ACTIONS.SAVE_SHEET_THEME_LAYOUT](
    { dispatch, getters },
    { themeId, layout, pagePosition }
  ) {
    const currentSheet = getters.getCurrentSheet;
    const sheetId = currentSheet.id;

    printService.saveSheetData(sheetId, layout.id, themeId);

    dispatch(PRINT._ACTIONS.UPDATE_SHEET_THEME_LAYOUT, {
      themeId,
      layout,
      pagePosition
    });
  },
  [PRINT._ACTIONS.UPDATE_SHEET_VISITED]({ commit }, { sheetId }) {
    printService.saveSheetVisited(sheetId);
    commit(PRINT._MUTATES.UPDATE_SHEET_VISITED, { sheetId });
  },
  [PRINT._ACTIONS.SAVE_PAGE_INFO]({ commit }, { pageInfo }) {
    printService.savePageInfo(pageInfo);
    commit(PRINT._MUTATES.SET_PAGE_INFO, { pageInfo });
  },
  [PRINT._ACTIONS.SAVE_SPREAD_INFO]({ getters, commit }, { spreadInfo }) {
    const currentSheet = getters.getCurrentSheet;
    const sheetId = currentSheet.id;
    printService.saveSpreadInfo(sheetId, spreadInfo);
    commit(PRINT._MUTATES.UPDATE_SPREAD_INFO, { spreadInfo });
  },
  [PRINT._ACTIONS.SAVE_SHEET_LINK_STATUS]({ commit }, { statusLink, sheetId }) {
    printService.saveSheetLinkStatus(sheetId, statusLink);
    commit(PRINT._MUTATES.SET_SHEET_LINK_STATUS, { statusLink, sheetId });
  },
  async [PRINT._ACTIONS.SAVE_LAYOUT]({ commit }, { layouts }) {
    await setPrintPpLayouts(layouts);
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
  },
  [PRINT._ACTIONS.SAVE_SHEET_THUMBNAIL]({ commit }, { thumbnailUrl, sheetId }) {
    printService.saveSheetThumbnail(sheetId, thumbnailUrl);
    commit(PRINT._MUTATES.UPDATE_SHEET_THUMBNAIL, { thumbnailUrl, sheetId });
  }
};
