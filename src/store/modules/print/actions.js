import { uniqueId } from 'lodash';

import { isEmpty, isHalfSheet } from '@/common/utils';
import printService from '@/api/print';

import { STATUS, OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';

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
    if (isEmpty(queryObjectResult.data)) {
      commit(PRINT._MUTATES.SET_OBJECTS, { objectList: [] });
      commit(PRINT._MUTATES.SET_BACKGROUNDS, { background: {} });
      return;
    }

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList: queryObjectResult.data });

    const backgrounds = queryObjectResult.data.filter(
      o => o.type === OBJECT_TYPE.BACKGROUND
    );

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

      if (Object.values(state.objects).length > 0) {
        Object.values(state.objects).forEach(obj => {
          objectList.push(obj);
        });
      }
    }

    commit(PRINT._MUTATES.SET_OBJECTS, { objectList });

    // Update sheet fields
    commit(PRINT._MUTATES.SET_SHEET_DATA, {
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });
  }
};
