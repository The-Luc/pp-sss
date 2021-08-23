import { useMutations, useGetters } from 'vuex-composition-helpers';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { useAppCommon } from './common';

/**
 * Trigger mutation to close popover, menu properties from icon creation tool
 * @return {Object} Function to reset print config
 */
export const useResetPrintConfig = () => {
  const { resetPrintConfig } = useMutations({
    resetPrintConfig: APP_MUTATES.RESET_PRINT_CONFIG
  });

  return {
    resetPrintConfig
  };
};

/**
 * Trigger mutation to close popover and getter selected tool name
 *  @return {Object} Function set tool name and selected tool name value
 */
export const usePopoverCreationTool = () => {
  const { mutate } = useMutations({
    mutate: APP_MUTATES.SET_TOOL_NAME_SELECTED
  });

  const { selectedToolName } = useGetters({
    selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
  });

  const setToolNameSelected = name => {
    mutate({
      name
    });
  };
  return {
    setToolNameSelected,
    selectedToolName
  };
};

export const useInfoBar = () => {
  const { infoBar, zoom } = useGetters({
    infoBar: APP_GETTERS.INFO_BAR,
    zoom: APP_GETTERS.ZOOM
  });

  const { setInfoBar } = useMutations({
    setInfoBar: APP_MUTATES.SET_INFO_BAR
  });

  return {
    infoBar,
    setInfoBar,
    zoom
  };
};

export const useToolBar = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const {
    themeId,
    selectedObjectType,
    propertiesType,
    isMenuOpen,
    selectedToolName,
    isMediaSidebarOpen,
    disabledToolbarItems
  } = useGetters({
    themeId: GETTERS.DEFAULT_THEME_ID,
    selectedObjectType: APP_GETTERS.SELECTED_OBJECT_TYPE,
    propertiesType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
    isMenuOpen: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
    selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME,
    isMediaSidebarOpen: APP_GETTERS.IS_MEDIA_SIDEBAR_OPEN,
    disabledToolbarItems: APP_GETTERS.DISABLED_TOOLBAR_ITEMS
  });

  const {
    setPropertiesType,
    toggleMenu,
    setToolNameSelected,
    updateMediaSidebarOpen,
    updateDisabledToolbarItems
  } = useMutations({
    setPropertiesType: APP_MUTATES.SET_PROPERTIES_OBJECT_TYPE,
    toggleMenu: APP_MUTATES.TOGGLE_MENU_PROPERTIES,
    setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED,
    updateMediaSidebarOpen: APP_MUTATES.UPDATE_MEDIA_SIDEBAR_OPEN,
    updateDisabledToolbarItems: APP_MUTATES.UPDATE_DISABLED_TOOLBAR_ITEMS
  });

  /**
   * Check is a non-element properties menu selected
   *
   * @param {String}  propertiesType  properties object type
   * @param {Boolean} isOpen          is properties menu open
   */
  const togglePropertiesMenu = (propertiesType, isOpen) => {
    setPropertiesType({ type: propertiesType });

    toggleMenu({ isOpen });
  };

  return {
    themeId,
    selectedObjectType,
    propertiesType,
    isMenuOpen,
    selectedToolName,
    setToolNameSelected,
    togglePropertiesMenu,
    isMediaSidebarOpen,
    updateMediaSidebarOpen,
    disabledToolbarItems,
    updateDisabledToolbarItems
  };
};
