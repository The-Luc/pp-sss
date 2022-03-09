import { useGetters, useMutations } from 'vuex-composition-helpers';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  DEFAULT_TEXT_STYLE_ID,
  MODAL_TYPES,
  OBJECT_TYPE
} from '@/common/constants';

import { pick } from 'lodash';
import {
  getTextStyleApi,
  getUserTextStyleApi,
  saveUserTextStyleApi
} from '@/api/text';
import { imageStyleMappingApi, textStyleMappingApi } from '@/common/mapping';
import {
  MAX_SAVED_IMAGE_STYLES,
  MAX_SAVED_TEXT_STYLES
} from '../common/constants/config';
import { getUserImageStyleApi, saveUserImageStyleApi } from '@/api/image';

export const useStyle = () => {
  const { modalData, currentObject } = useGetters({
    modalData: GETTERS.MODAL_DATA,
    currentObject: GETTERS.CURRENT_OBJECT
  });

  const { toggleModal } = useMutations({
    toggleModal: MUTATES.TOGGLE_MODAL
  });

  const { saveUserTextStyles } = useTextStyle();
  const { saveUserImageStyles } = useImageStyle();

  const onSaveStyle = async prop => {
    const objectType = currentObject?.value?.type;

    const isSaveTextModal = [
      MODAL_TYPES.SAVE_STYLE,
      MODAL_TYPES.SAVE_STYLE_SUCCESS
    ].includes(modalData?.value?.type);

    const showModal = (id, type, modalType) => {
      const props = id ? { objectType: type, styleId: id } : { type };

      toggleModal({
        isOpenModal: true,
        modalData: {
          type: modalType || MODAL_TYPES.SAVE_STYLE_SUCCESS,
          props
        }
      });
    };

    if (isSaveTextModal) {
      toggleModal({ isOpenModal: false });

      if (!prop || objectType !== OBJECT_TYPE.TEXT) return;

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

      const savedStyle = await saveUserTextStyles(style);

      if (!savedStyle) return;

      showModal(savedStyle?.id, OBJECT_TYPE.TEXT);
      return;
    }

    if (objectType === OBJECT_TYPE.IMAGE) {
      const { border, shadow } = currentObject?.value || {};

      const imageStyle = {
        ...border,
        ...shadow
      };

      const savedStyle = await saveUserImageStyles(imageStyle);

      if (!savedStyle) return;

      showModal(savedStyle?.id, OBJECT_TYPE.IMAGE);

      return;
    }

    showModal(null, currentObject?.value?.type, MODAL_TYPES.SAVE_STYLE);
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

  const getFontName = id => {
    const font = fonts.value.find(f => String(f.id) === String(id));
    return font?.name;
  };

  const setFontFamily = styles => {
    styles.forEach(s => {
      const fontFamily = getFontName(s.style.fontId);
      s.style.fontFamily = fontFamily;
    });
  };

  const loadUserTextStyles = async () => {
    const styles = await getUserTextStyleApi();

    setFontFamily(styles);

    setUserTextStyles({ styles });
  };

  const loadTextStyles = async () => {
    const styles = await getTextStyleApi();

    // re-order default style to 1st position
    const defaultIndex = styles.findIndex(
      style => style.id === DEFAULT_TEXT_STYLE_ID
    );

    const defaultStyle = styles.splice(defaultIndex, 1)[0];
    styles.unshift(defaultStyle);

    setFontFamily(styles);
    setTextStyles({ styles });
  };

  const saveUserTextStyles = async style => {
    const apiStyle = textStyleMappingApi(style);
    const fontId = fonts.value.find(font => font.name === style.fontFamily).id;
    apiStyle.font_id = +fontId;

    const userStyle = await saveUserTextStyleApi(apiStyle);

    if (!userStyle) return;

    userStyle.style.fontFamily = style.fontFamily;

    const currentStyles = userTextStyles.value;

    const styles = [...currentStyles, userStyle].slice(-MAX_SAVED_TEXT_STYLES);
    setUserTextStyles({ styles });

    return userStyle;
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
  const { userImageStyles } = useGetters({
    userImageStyles: GETTERS.USER_IMAGE_STYLES
  });

  const { setUserImageStyles } = useMutations({
    setUserImageStyles: MUTATES.SET_USER_IMAGE_STYLES
  });

  const loadUserImageStyles = async () => {
    const styles = await getUserImageStyleApi();

    setUserImageStyles({ styles });
  };

  const saveUserImageStyles = async style => {
    const apiStyle = imageStyleMappingApi(style);
    const userStyle = await saveUserImageStyleApi(apiStyle);

    const currentStyles = userImageStyles.value;

    const styles = [...currentStyles, userStyle].slice(-MAX_SAVED_IMAGE_STYLES);
    setUserImageStyles({ styles });

    return userStyle;
  };

  return {
    ...useStyle,
    userImageStyles,
    saveUserImageStyles,
    loadUserImageStyles
  };
};
