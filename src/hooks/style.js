import { useActions, useGetters, useMutations } from 'vuex-composition-helpers';

import { ACTIONS, GETTERS, MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

export const useTextStyle = () => {
  const { saveTextStyle, getSavedTextStyles } = useActions({
    saveTextStyle: ACTIONS.SAVE_TEXT_STYLE,
    getSavedTextStyles: ACTIONS.GET_SAVED_TEXT_STYLES
  });

  const { savedTextStyles, modalData, currentObject } = useGetters({
    savedTextStyles: GETTERS.SAVED_TEXT_STYLES,
    modalData: GETTERS.MODAL_DATA,
    currentObject: GETTERS.CURRENT_OBJECT
  });

  const { toggleModal } = useMutations({
    toggleModal: MUTATES.TOGGLE_MODAL
  });

  const onSaveTextStyle = prop => {
    if (
      [MODAL_TYPES.SAVE_STYLE, MODAL_TYPES.SAVE_STYLE_SUCCESS].includes(
        modalData?.value?.type
      )
    ) {
      toggleModal({ isOpenModal: false });
      if (!prop) return;
      const name = prop.styleName || 'Untitled';
      const value = Date.now();
      const { fontFamily, fontSize, isBold, isItalic, isUnderline, color } =
        currentObject?.value || {};
      const textStyle = {
        name,
        value,
        style: {
          fontFamily,
          fontSize,
          isBold,
          isItalic,
          isUnderline,
          color
        },
        isCustom: true
      };
      saveTextStyle({ textStyle });
    } else {
      toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_STYLE
        }
      });
    }
  };

  return {
    saveTextStyle,
    getSavedTextStyles,
    savedTextStyles,
    onSaveTextStyle
  };
};

export const useImageStyle = () => {
  const { saveImageStyle, getSavedImageStyles } = useActions({
    saveImageStyle: ACTIONS.SAVE_IMAGE_STYLE,
    getSavedImageStyles: ACTIONS.GET_SAVED_IMAGE_STYLES
  });

  const { savedImageStyles, modalData, currentObject } = useGetters({
    savedImageStyles: GETTERS.SAVED_IMAGE_STYLES,
    modalData: GETTERS.MODAL_DATA,
    currentObject: GETTERS.CURRENT_OBJECT
  });

  const { toggleModal } = useMutations({
    toggleModal: MUTATES.TOGGLE_MODAL
  });

  const onSaveImageStyle = prop => {
    if (
      [MODAL_TYPES.SAVE_STYLE, MODAL_TYPES.SAVE_STYLE_SUCCESS].includes(
        modalData?.value?.type
      )
    ) {
      toggleModal({ isOpenModal: false });
      if (!prop) return;
      const name = prop.styleName || 'Untitled';
      const value = Date.now();
      const imageStyle = { name, value };
      saveImageStyle({ imageStyle });
    } else {
      toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_STYLE
        }
      });
    }
  };

  return {
    saveImageStyle,
    getSavedImageStyles,
    savedImageStyles,
    onSaveImageStyle
  };
};
