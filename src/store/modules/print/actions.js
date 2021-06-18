import { isEmpty } from '@/common/utils';
import printService from '@/api/print';

import { STATUS, OBJECT_TYPE } from '@/common/constants';

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

    if (isEmpty(state.currentSheetId)) {
      const defaultSheetId = state.sections[0].sheets[0];

      commit(PRINT._MUTATES.SET_CURRENT_SHEET_ID, {
        id: state.sheets[defaultSheetId].id
      });
    }

    dispatch(PRINT._ACTIONS.GET_DATA_CANVAS);
  },
  async [PRINT._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    const queryObjectResult = await printService.getSheetObjects(
      state.book.id,
      state.sheets[state.currentSheetId].sectionId,
      state.currentSheetId
    );

    if (isEmpty(queryObjectResult.data)) return;

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: queryObjectResult.data });

    const backgrounds = queryObjectResult.data.filter(
      o => o.type === OBJECT_TYPE.BACKGROUND
    );

    backgrounds.forEach(bg =>
      commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: bg })
    );
  }
};
