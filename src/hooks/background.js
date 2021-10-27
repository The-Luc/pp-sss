import { useGetters, useMutations } from 'vuex-composition-helpers';

import { getBackgroundCategories, getBackgrounds } from '@/api/background/api';
import mockBackgroundService from '@/api/mockBackground';
import { getThemes } from '@/api/themes';

import { useAppCommon } from './common';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import { BACKGROUND_TYPE, BACKGROUND_TYPE_NAME } from '@/common/constants';

export const useBackgroundProperties = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

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

export const useBackgroundMenu = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

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
    const [categories, themes] = await Promise.all([
      getBackgroundCategories(),
      getThemes()
    ]);
    return {
      [BACKGROUND_TYPE_NAME.THEME]: {
        id: BACKGROUND_TYPE.THEME.id,
        value: themes || []
      },
      [BACKGROUND_TYPE_NAME.CATEGORY]: {
        id: BACKGROUND_TYPE.CATEGORY.id,
        value: categories || []
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
  ) =>
    getBackgrounds(backgroundTypeId, backgroundTypeSubId, backgroundPageTypeId);

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
  const getBackgroundData = async (backgroundTypeId, backgroundTypeSubId) =>
    getBackgrounds(backgroundTypeId, backgroundTypeSubId);

  return {
    ...useBackgroundMenu(),
    getBackgroundData
  };
};

export const useBackgroundGetter = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { backgrounds } = useGetters({
    backgrounds: GETTERS.BACKGROUNDS
  });

  return {
    backgrounds
  };
};

export const useBackgroundAction = () => {
  return {
    getPageBackground: mockBackgroundService.getPageBackground,
    getPageBackgrounds: mockBackgroundService.getPageBackgrounds,
    getFrameBackground: mockBackgroundService.getFrameBackground,
    getFrameBackgrounds: mockBackgroundService.getFrameBackgrounds
  };
};
