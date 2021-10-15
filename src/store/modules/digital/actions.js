import digitalService from '@/api/digital';

import { STATUS, OBJECT_TYPE } from '@/common/constants';
import { getUniqueId } from '@/common/utils';

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
  async [DIGITAL._ACTIONS.GET_DATA_EDIT]({ state, commit }) {
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
  },
  async [DIGITAL._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    // clear all objects and backgrounds
    commit(DIGITAL._MUTATES.SET_OBJECTS, { objectList: [] });
    commit(DIGITAL._MUTATES.SET_BACKGROUND, { backgrounds: {} });

    // update frames and frameIds
    const queryFramesResult = await digitalService.getFrames(
      state.book.id,
      state.sheets[state.currentSheetId].sectionId,
      state.currentSheetId
    );

    const data = queryFramesResult.data;

    commit(DIGITAL._MUTATES.SET_FRAMES, { framesList: data });
  },
  [DIGITAL._ACTIONS.UPDATE_SHEET_THEME_LAYOUT](
    { commit },
    { themeId, layout }
  ) {
    // Update sheet fields
    commit(DIGITAL._MUTATES.SET_SHEET_DATA, {
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });

    // adding Id to each frame
    const frames = layout.frames.map(f => ({ ...f, id: getUniqueId() }));

    // set the first frame is the active one
    commit(DIGITAL._MUTATES.SET_CURRENT_FRAME_ID, { id: frames[0].id });
    // set Frames, frameIds and activeFrame
    commit(DIGITAL._MUTATES.SET_FRAMES, { framesList: frames });
  },
  [DIGITAL._ACTIONS.UPDATE_OBJECTS_TO_STORE]({ commit }, { objects }) {
    // Get background object
    const [backgroundObj] = objects.filter(
      obj => obj.type === OBJECT_TYPE.BACKGROUND
    );

    commit(DIGITAL._MUTATES.SET_BACKGROUND, { background: backgroundObj });

    // Get object(s) rest
    const objectList = objects.filter(
      obj => obj.type !== OBJECT_TYPE.BACKGROUND
    );

    commit(DIGITAL._MUTATES.SET_OBJECTS, { objectList });
  },
  async [DIGITAL._ACTIONS.UPDATE_SHEET_MEDIA]({ commit, state }, { media }) {
    const currentMedia = await digitalService.getSheetMedia(
      state.currentSheetId
    );
    const newMedia = [...media, ...currentMedia];
    await digitalService.saveSheetMedia(state.currentSheetId, newMedia);
    commit(DIGITAL._MUTATES.SET_SHEET_MEDIA, { media: newMedia });
  }
};
