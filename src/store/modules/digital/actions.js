import { uniqueId } from 'lodash';

import { isEmpty, isHalfSheet } from '@/common/utils';
import digitalService from '@/api/digital';

import { STATUS, OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';

import DIGITAL from './const';

export const actions = {
  async [DIGITAL._ACTIONS.GET_DATA_MAIN]({ state, commit }) {
    const queryResult = await digitalService.geDigitalSectionsSheets(
      state.book.id
    );

    if (queryResult.status !== STATUS.OK) return;

    commit(DIGITAL._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: queryResult.data
    });
  },
  async [DIGITAL._ACTIONS.GET_DATA_EDIT]({ state, dispatch, commit }) {
    const queryResults = await Promise.all([
      digitalService.getDefaultThemeId(state.book.id),
      digitalService.getDigitalEditSectionsSheets(state.book.id)
    ]);

    if (queryResults[1].status !== STATUS.OK) return;

    commit(DIGITAL._MUTATES.SET_DEFAULT_THEME_ID, {
      themeId: queryResults[0].data
    });

    commit(DIGITAL._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: queryResults[1].data
    });

    if (isEmpty(state.currentSheetId)) {
      const defaultSheetId = state.sections[0].sheets[0];

      commit(DIGITAL._MUTATES.SET_CURRENT_SHEET_ID, {
        id: state.sheets[defaultSheetId].id
      });
    }

    dispatch(DIGITAL._ACTIONS.GET_DATA_CANVAS);
  },
  async [DIGITAL._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    const queryObjectResult = await digitalService.getSheetObjects(
      state.book.id,
      state.sheets[state.currentSheetId].sectionId,
      state.currentSheetId
    );
    if (isEmpty(queryObjectResult.data)) {
      commit(DIGITAL._MUTATES.SET_OBJECTS, { objectList: [] });
      commit(DIGITAL._MUTATES.SET_BACKGROUNDS, { background: {} });
      return;
    }

    commit(DIGITAL._MUTATES.SET_OBJECTS, { objectList: queryObjectResult.data });

    const backgrounds = queryObjectResult.data.filter(
      o => o.type === OBJECT_TYPE.BACKGROUND
    );

    backgrounds.forEach(bg =>
      commit(DIGITAL._MUTATES.SET_BACKGROUNDS, { background: bg })
    );
  },
  [DIGITAL._ACTIONS.UPDATE_SHEET_THEME_LAYOUT](
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
        commit(DIGITAL._MUTATES.SET_BACKGROUNDS, { background: bg });
      });
    }

    if (backgroundObjs.length === 1) {
      backgroundObjs[0].isLeftPage = currentPosition === 'left';
      commit(DIGITAL._MUTATES.SET_BACKGROUNDS, { background: backgroundObjs[0] });
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
      commit(DIGITAL._MUTATES.REMOVE_OBJECTS, { currentPosition });

      if (Object.values(state.objects).length > 0) {
        Object.values(state.objects).forEach(obj => {
          objectList.push(obj);
        });
      }
    }

    commit(DIGITAL._MUTATES.SET_OBJECTS, { objectList });

    // Update sheet fields
    commit(DIGITAL._MUTATES.SET_SHEET_DATA, {
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });
  }
};
