import { uniqueId } from 'lodash';

import { isEmpty, isHalfSheet } from '@/common/utils';
import digitalService from '@/api/digital';

import { STATUS, OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';

import DIGITAL from './const';

export const actions = {
  async [DIGITAL._ACTIONS.GET_DATA_MAIN]({ state, commit }) {
    const queryResult = await digitalService.getDigitalSectionsSheets(
      state.book.id
    );

    if (queryResult.status !== STATUS.OK) return;

    commit(DIGITAL._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: queryResult.data
    });
  },
  async [DIGITAL._ACTIONS.GET_DATA_EDIT]({ state, dispatch, commit }) {
    const [themeQuery, sectionsSheetsQuery] = await Promise.all([
      digitalService.getDefaultThemeId(state.book.id),
      digitalService.getDigitalEditSectionsSheets(state.book.id)
    ]);

    if (sectionsSheetsQuery.status !== STATUS.OK) return;

    commit(DIGITAL._MUTATES.SET_DEFAULT_THEME_ID, {
      themeId: themeQuery.data
    });

    commit(DIGITAL._MUTATES.SET_SECTIONS_SHEETS, {
      sectionsSheets: sectionsSheetsQuery.data
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

    commit(DIGITAL._MUTATES.SET_OBJECTS, {
      objectList: queryObjectResult.data
    });

    const backgrounds = queryObjectResult.data.filter(
      o => o.type === OBJECT_TYPE.BACKGROUND
    );

    backgrounds.forEach(bg =>
      commit(DIGITAL._MUTATES.SET_BACKGROUNDS, { background: bg })
    );
  },
  [DIGITAL._ACTIONS.UPDATE_SHEET_THEME_LAYOUT](
    { commit, dispatch },
    { themeId, layout }
  ) {
    const updateStorePayload = {
      layout: layout.frames[0]
    };
    dispatch(DIGITAL._ACTIONS.UPDATE_LAYOUT_OBJ_TO_STORE, updateStorePayload);

    // Update sheet fields
    commit(DIGITAL._MUTATES.SET_SHEET_DATA, {
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });

    // adding Id to each frame
    const frames = layout.frames.map(f => ({ id: uniqueId(), frame: f }));

    // set the first frame is the active one
    commit(DIGITAL._MUTATES.SET_CURRENT_FRAME_ID, { id: frames[0].id });
    // set Frames, frameIds and activeFrame
    commit(DIGITAL._MUTATES.SET_FRAMES, { framesList: frames });
  },
  [DIGITAL._ACTIONS.UPDATE_LAYOUT_OBJ_TO_STORE](
    { state, commit },
    { layout, pagePosition }
  ) {
    const currentSheet = state.sheets[state.currentSheetId];
    let currentPosition = pagePosition; // Check whether user has add single page or not. Value: left or right with single page else undefine

    if (currentSheet.type === SHEET_TYPE.FRONT_COVER) {
      // Front cover always has the right page
      currentPosition = 'right';
    }

    if (currentSheet.type === SHEET_TYPE.BACK_COVER) {
      // Back cover always has the left page
      currentPosition = 'left';
    }

    // Get background object
    const [backgroundObj] = layout.objects.filter(
      obj => obj.type === OBJECT_TYPE.BACKGROUND
    );

    if (!isEmpty(backgroundObj)) {
      commit(DIGITAL._MUTATES.SET_BACKGROUNDS, { background: backgroundObj });
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
  }
};
