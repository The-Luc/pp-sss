import { isEmpty } from '@/common/utils';
import printService from '@/api/print';

import { STATUS } from '@/common/constants';

import PRINT from './const';

export const actions = {
  async [PRINT._ACTIONS.GET_DATA_MAIN]({ commit }, { bookId }) {
    const queryResult = await printService.getPrintSectionsSheets(bookId);

    if (queryResult.status !== STATUS.OK) return;

    commit(PRINT._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: queryResult.data
    });
  },
  async [PRINT._ACTIONS.GET_DATA_EDIT]({ state, dispatch, commit }) {
    const queryResults = await Promise.all([
      printService.getDefaultThemeId(state.book.id),
      printService.getPrintEditSectionsSheets(state.book.id)
    ]);

    if (queryResults[1].status !== STATUS.OK) return;

    commit(PRINT._MUTATES.SET_DEFAULT_THEME_ID, {
      themeId: queryResults[0].data
    });

    commit(PRINT._MUTATES.SET_SECTIONS_SHEETS_EDIT, {
      sectionsSheets: queryResults[1].data
    });

    const currentSectionId = isEmpty(state.book.sectionId)
      ? queryResults[1].data[0].id
      : state.book.sectionId;
    const currentSheetId = isEmpty(state.book.sheetId)
      ? queryResults[1].data[0].sheets[0].id
      : state.book.sheetId;

    commit(PRINT._MUTATES.SET_BASE_INFO, {
      sectionId: currentSectionId,
      sheetId: currentSheetId
    });

    dispatch(PRINT._ACTIONS.GET_DATA_CANVAS, {
      sectionId: currentSectionId,
      sheetId: currentSheetId
    });
  },
  async [PRINT._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    const queryObjectResult = await printService.getSheetObjects(
      state.book.id,
      state.book.sectionId,
      state.book.sheetId
    );

    if (isEmpty(queryObjectResult.data)) return;

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: queryObjectResult.data });
  }
};
