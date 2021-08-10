import APP from './const';
import styleService from '@/api/style';
import appService from '@/api/app';
import { MODAL_TYPES, OBJECT_TYPE } from '@/common/constants';

export const actions = {
  async [APP._ACTIONS.SAVE_TEXT_STYLE]({ commit }, { textStyle }) {
    const savedTextStyles = await styleService.saveTextStyle(textStyle);
    commit(APP._MUTATES.TOGGLE_MODAL, {
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_STYLE_SUCCESS,
        props: {
          styleId: textStyle?.id,
          objectType: OBJECT_TYPE.TEXT
        }
      }
    });
    commit(APP._MUTATES.SET_SAVED_TEXT_STYLES, { savedTextStyles });
  },

  async [APP._ACTIONS.GET_SAVED_TEXT_STYLES]({ commit }) {
    const savedTextStyles = await styleService.getSavedTextStyles();
    commit(APP._MUTATES.SET_SAVED_TEXT_STYLES, { savedTextStyles });
  },

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
    commit(APP._MUTATES.SET_SAVED_IMAGE_STYLES, { savedImageStyles });
  },

  async [APP._ACTIONS.GET_SAVED_IMAGE_STYLES]({ commit }) {
    const savedImageStyles = await styleService.getSavedImageStyles();
    commit(APP._MUTATES.SET_SAVED_IMAGE_STYLES, { savedImageStyles });
  },

  async [APP._ACTIONS.GET_APP_DETAIL]({ commit }) {
    const { isPhotoVisited } = await appService.getAppDetail();
    commit(APP._MUTATES.SET_PHOTO_VISITED, { isPhotoVisited });
  },

  async [APP._ACTIONS.UPDATE_PHOTO_VISITED]({ commit }, { isPhotoVisited }) {
    await appService.setIsPhotoVisited(isPhotoVisited);
    commit(APP._MUTATES.SET_PHOTO_VISITED, { isPhotoVisited });
  }
};
