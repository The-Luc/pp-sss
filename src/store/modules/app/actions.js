import APP from './const';
import styleService from '@/api/style';
import { MODAL_TYPES, OBJECT_TYPE } from '@/common/constants';

export const actions = {
  async [APP._ACTIONS.SAVE_IMAGE_STYLE]({ commit }, { imageStyle }) {
    const savedImageStyles = await styleService.saveImageStyle(imageStyle);
    commit(APP._MUTATES.TOGGLE_MODAL, {
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_STYLE_SUCCESS,
        props: {
          styleId: imageStyle?.id,
          objectType: OBJECT_TYPE.IMAGE
        }
      }
    });
    commit(APP._MUTATES.SET_USER_IMAGE_STYLES, { savedImageStyles });
  },

  async [APP._ACTIONS.GET_SAVED_IMAGE_STYLES]({ commit }) {
    const savedImageStyles = await styleService.getSavedImageStyles();
    commit(APP._MUTATES.SET_USER_IMAGE_STYLES, { savedImageStyles });
  }
};
