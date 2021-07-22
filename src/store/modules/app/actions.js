import APP from './const';
import styleService from '@/api/style';
import { MODAL_TYPES } from '@/common/constants';

export const actions = {
  async [APP._ACTIONS.SAVE_TEXT_STYLE]({ commit }, { textStyle }) {
    const savedTextStyles = await styleService.saveTextStyle(textStyle);
    commit(APP._MUTATES.TOGGLE_MODAL, {
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_STYLE_SUCCESS,
        props: textStyle
      }
    });
    commit(APP._MUTATES.SET_SAVED_TEXT_STYLE, { savedTextStyles });
  },

  async [APP._ACTIONS.GET_SAVED_TEXT_STYLES]({ commit }) {
    const savedTextStyles = await styleService.getSavedTextStyles();
    commit(APP._MUTATES.SET_SAVED_TEXT_STYLE, { savedTextStyles });
  }
};
