import { useGetters, useMutations } from 'vuex-composition-helpers';

import backgroundService from '@/api/background';
import themeService from '@/api/themes';

import { isOk } from '@/common/utils';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import { BACKGROUND_TYPE, BACKGROUND_TYPE_NAME } from '@/common/constants';

export const useBackgroundProperties = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { triggerChange, backgroundsProps } = useGetters({
    triggerChange: GETTERS.TRIGGER_BACKGROUND_CHANGE,
    backgroundsProps: GETTERS.BACKGROUNDS_PROPERTIES
  });

  return {
    triggerChange,
    backgroundsProps
  };
};

export const useBackgroundMenu = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { currentThemeId, userSelectedBackground } = useGetters({
    currentThemeId: GETTERS.DEFAULT_THEME_ID,
    userSelectedBackground: GETTERS.BACKGROUNDS_NO_LAYOUT
  });

  const { toggleModal } = useMutations({
    toggleModal: APP_MUTATES.TOGGLE_MODAL
  });

  /**
   * Get background type data from API
   */
  const getBackgroundTypeData = async () => {
    const getCategories = isDigital
      ? backgroundService.getDigitalCategories
      : backgroundService.getPrintCategories;

    const getThemes = isDigital
      ? themeService.getDigitalThemes
      : themeService.getPrintThemes;

    const [categories, themes] = await Promise.all([
      getCategories(),
      getThemes()
    ]);

    return {
      [BACKGROUND_TYPE_NAME.THEME]: {
        id: BACKGROUND_TYPE.THEME.id,
        value: isOk(themes) ? themes.data : []
      },
      [BACKGROUND_TYPE_NAME.CATEGORY]: {
        id: BACKGROUND_TYPE.CATEGORY.id,
        value: isOk(categories) ? categories.data : []
      },
      [BACKGROUND_TYPE_NAME.CUSTOM]: {
        id: BACKGROUND_TYPE.CUSTOM.id,
        value: []
      },
      [BACKGROUND_TYPE_NAME.FAVORITE]: {
        id: BACKGROUND_TYPE.FAVORITE.id,
        value: []
      }
    };
  };

  return {
    currentThemeId,
    userSelectedBackground,
    toggleModal,
    getBackgroundTypeData
  };
};

export const usePrintBackgroundMenu = () => {
  const { currentSheet } = useGetters({
    currentSheet: PRINT_GETTERS.CURRENT_SHEET
  });

  /**
   * Get background data from API
   */
  const getBackgroundData = async (
    backgroundTypeId,
    backgroundTypeSubId,
    backgroundPageTypeId
  ) => {
    const backgrounds = await backgroundService.getPrintBackgrounds(
      backgroundTypeId,
      backgroundTypeSubId,
      backgroundPageTypeId
    );

    return isOk(backgrounds) ? backgrounds.data : [];
  };

  return {
    currentSheet,
    ...useBackgroundMenu(),
    getBackgroundData
  };
};

export const useDigitalBackgroundMenu = () => {
  /**
   * Get background data from API
   */
  const getBackgroundData = async (backgroundTypeId, backgroundTypeSubId) => {
    const backgrounds = await backgroundService.getDigitalBackgrounds(
      backgroundTypeId,
      backgroundTypeSubId
    );

    return isOk(backgrounds) ? backgrounds.data : [];
  };

  return {
    ...useBackgroundMenu(true),
    getBackgroundData
  };
};

export const useBackgroundGetter = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { backgrounds } = useGetters({
    backgrounds: GETTERS.BACKGROUNDS
  });

  return {
    backgrounds
  };
};
