import { useActions, useGetters, useMutations } from 'vuex-composition-helpers';

import { ACTIONS, GETTERS, MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES, OBJECT_TYPE } from '@/common/constants';

import { pick } from 'lodash';
import {
  getTextStyleApi,
  getUserTextStyleApi,
  saveUserTextStyleApi
} from '@/api/text';
import { textStyleMappingApi } from '@/common/mapping';

export const useStyle = () => {
  const { modalData, currentObject } = useGetters({
    modalData: GETTERS.MODAL_DATA,
    currentObject: GETTERS.CURRENT_OBJECT
  });

  const { toggleModal } = useMutations({
    toggleModal: MUTATES.TOGGLE_MODAL
  });

  const { saveTextStyle, saveImageStyle } = useActions({
    saveTextStyle: ACTIONS.SAVE_TEXT_STYLE,
    saveImageStyle: ACTIONS.SAVE_IMAGE_STYLE
  });
  const { saveUserTextStyles } = useTextStyle();

  const onSaveStyle = prop => {
    const objectType = currentObject?.value?.type;

    const isSaveTextModal = [
      MODAL_TYPES.SAVE_STYLE,
      MODAL_TYPES.SAVE_STYLE_SUCCESS
    ].includes(modalData?.value?.type);

    if (isSaveTextModal) {
      toggleModal({ isOpenModal: false });
      if (!prop) return;

      if (objectType === OBJECT_TYPE.TEXT) {
        const style = pick(currentObject?.value, [
          'fontFamily',
          'fontSize',
          'isBold',
          'isItalic',
          'isUnderline',
          'color',
          'alignment',
          'textCase',
          'letterSpacing',
          'lineSpacing',
          'flip',
          'border',
          'shadow'
        ]);

        style.name = prop?.styleName?.trim() || 'Untitled';

        saveUserTextStyles(style);
      }
    } else {
      if (objectType === OBJECT_TYPE.IMAGE) {
        const { border, shadow } = currentObject?.value || {};

        const imageStyle = {
          id: Date.now(),
          style: {
            border,
            shadow
          },
          isCustom: true
        };

        saveImageStyle({ imageStyle });
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
    }
  };

  return {
    onSaveStyle
  };
};

export const useTextStyle = () => {
  const { userTextStyles, textStyles, fonts } = useGetters({
    userTextStyles: GETTERS.USER_TEXT_STYLES,
    textStyles: GETTERS.TEXT_STYLES,
    fonts: GETTERS.GET_FONTS
  });

  const { setTextStyles, setUserTextStyles } = useMutations({
    setTextStyles: MUTATES.SET_TEXT_STYLES,
    setUserTextStyles: MUTATES.SET_USER_TEXT_STYLES
  });

  const loadUserTextStyles = async () => {
    const styles = await getUserTextStyleApi();

    setUserTextStyles({ styles });
  };

  const loadTextStyles = async () => {
    const styles = await getTextStyleApi();

    setTextStyles({ styles });
  };

  const saveUserTextStyles = async style => {
    const apiStyle = textStyleMappingApi(style);
    const fontId = fonts.value.find(font => font.name === style.fontFamily).id;
    apiStyle.font_id = +fontId;

    const userStyle = await saveUserTextStyleApi(apiStyle);

    const currentStyles = userTextStyles.value;

    const styles = [...currentStyles, userStyle];
    setUserTextStyles({ styles });
  };

  return {
    ...useStyle,
    userTextStyles,
    textStyles,
    loadTextStyles,
    loadUserTextStyles,
    saveUserTextStyles
  };
};

export const useImageStyle = () => {
  const { savedImageStyles } = useGetters({
    savedImageStyles: GETTERS.SAVED_IMAGE_STYLES
  });

  const { getSavedImageStyles } = useActions({
    getSavedImageStyles: ACTIONS.GET_SAVED_IMAGE_STYLES
  });

  return {
    ...useStyle,
    savedImageStyles,
    getSavedImageStyles
  };
};
