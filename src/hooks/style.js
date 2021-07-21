import { useActions, useGetters, useMutations } from 'vuex-composition-helpers';

import { ACTIONS, GETTERS, MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES, OBJECT_TYPE } from '@/common/constants';

export const useStyle = () => {
  const {
    modalData,
    currentObject,
  } = useGetters({
    modalData: GETTERS.MODAL_DATA,
    currentObject: GETTERS.CURRENT_OBJECT,
  });

  const { toggleModal } = useMutations({
    toggleModal: MUTATES.TOGGLE_MODAL
  });

  const {
    saveTextStyle,
    saveImageStyle
  } = useActions({
    saveTextStyle: ACTIONS.SAVE_TEXT_STYLE,
    saveImageStyle: ACTIONS.SAVE_IMAGE_STYLE,
  });

  const onSaveStyle = prop => {
    if (
      [MODAL_TYPES.SAVE_STYLE, MODAL_TYPES.SAVE_STYLE_SUCCESS].includes(
        modalData?.value?.type
      )
    ) {
      toggleModal({ isOpenModal: false });
      if (!prop) return;
      const name = prop.styleName || 'Untitled';
      const value = Date.now();

      const objectType = currentObject?.value?.type;

      if (objectType === OBJECT_TYPE.TEXT) {
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
      }

      if (objectType === OBJECT_TYPE.IMAGE) {
        const imageStyle = {
          name,
          value
        };

        saveImageStyle({ imageStyle });
      }
    } else {
      toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_STYLE,
          props: {
            type: currentObject?.value?.type
          }
        }
      });
    }
  };

  return {
    onSaveStyle
  };
};

export const useTextStyle = () => {
  const {
    savedTextStyles
  } = useGetters({
    savedTextStyles: GETTERS.SAVED_TEXT_STYLES
  });

  const {
    getSavedTextStyles,
  } = useActions({
    getSavedTextStyles: ACTIONS.GET_SAVED_TEXT_STYLES
  });

  return {
    ...useStyle,
    savedTextStyles,
    getSavedTextStyles
  };
}

export const useImageStyle = () => {
  const {
    savedImageStyles
  } = useGetters({
    savedImageStyles: GETTERS.SAVED_IMAGE_STYLES
  });

  const {
    getSavedImageStyles,
  } = useActions({
    getSavedImageStyles: ACTIONS.GET_SAVED_IMAGE_STYLES
  });

  return {
    ...useStyle,
    savedImageStyles,
    getSavedImageStyles
  };
}
