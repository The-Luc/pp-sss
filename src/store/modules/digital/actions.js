import { getFramesAndTransitionsApi } from '@/api/frame';

import { OBJECT_TYPE } from '@/common/constants';

import DIGITAL from './const';

export const actions = {
  async [DIGITAL._ACTIONS.GET_DATA_CANVAS]({ state, commit }) {
    // clear all objects and backgrounds
    commit(DIGITAL._MUTATES.SET_OBJECTS, { objectList: [] });
    commit(DIGITAL._MUTATES.SET_BACKGROUND, { backgrounds: {} });
    commit(DIGITAL._MUTATES.CLEAR_ALL_FRAMES);

    const { frames } = await getFramesAndTransitionsApi(state.currentSheetId);

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
  }
};
