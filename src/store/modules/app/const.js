import { BaseObject } from '@/common/models';
import { prefixObjectValue } from '@/common/utils';

export const MODULE_NAME = 'app';

class GetterClass extends BaseObject {
  ACTIVE_EDITION = 'activeEdition';
  IS_PRINT_ACTIVE = 'isPrintActive';
  IS_DIGITAL_ACTIVE = 'isDigitalActive';
  IS_OPEN_MODAL = 'isOpenModal';
  MODAL_DATA = 'modalData';
  SECTION_SELECTED = 'sectionSelected';
  SELECTED_OBJECT_TYPE = 'selectedObjectType';
  IS_OPEN_MENU_PROPERTIES = 'isOpenMenuProperties';
  SELECTED_TOOL_NAME = 'selectedToolName';
  COLOR_PICKER_PRESETS = 'colorPickerPresets';
  IS_PROMPT = 'isPrompt';
  HAS_ACTIVE_OBJECTS = 'hasActiveObjects';
  PROPERTIES_OBJECT_TYPE = 'getPropertiesObjectType';
  TAB_SELECTED_OBJECT_ID = 'getSelectedObjectIdForTab';
  INFO_BAR = 'getInfoBar';
  ZOOM = 'getZoom';
  CURRENT_OBJECT = 'currentObject';
  SELECT_PROP_CURRENT_OBJECT = 'getSpecificPropertyOfCurrentObject';
  USER = 'getCurrentUser';
  GENERAL_INFO = 'generalInfo';
  USER_TEXT_STYLES = 'userTextStyles';
  USER_IMAGE_STYLES = 'userImageStyles';
  TEXT_STYLES = 'textStyles';
  SAVING_STATUS = 'savingStatus';
  IS_MEDIA_SIDEBAR_OPEN = 'isMediaSidebarOpen';
  DISABLED_TOOLBAR_ITEMS = 'getDisabledToolbarItems';
  IS_LOADING = 'isLoading';
  GET_FONTS = 'getFonts';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _GETTERS = new GetterClass();

export const GETTERS = new GetterClass(
  prefixObjectValue(_GETTERS, MODULE_NAME)
);

class MutationClass extends BaseObject {
  SET_ACTIVE_EDITION = 'setActiveEdition';
  TOGGLE_MODAL = 'toggleModal';
  SET_SELECTION_SELECTED = 'setSectionSelected';
  SET_OBJECT_TYPE_SELECTED = 'setObjectTypeSelected';
  TOGGLE_MENU_PROPERTIES = 'toggleMenuProperties';
  RESET_PRINT_CONFIG = 'resetPrintConfig';
  SET_TOOL_NAME_SELECTED = 'setToolNameSelected';
  SET_COLOR_PICKER_PRESETS = 'setColorPickerPresets';
  SET_IS_PROMPT = 'setIsPrompt';
  TOGGLE_ACTIVE_OBJECTS = 'toggleActiveObjects';
  SET_PROPERTIES_OBJECT_TYPE = 'setPropertiesObjectType';
  SET_INFO_BAR = 'setInfoBarData';
  SET_CURRENT_OBJECT = 'setCurrentObject';
  SET_USER = 'setCurrentUser';
  SET_GENERAL_INFO = 'setGeneralInfo';
  SET_TEXT_STYLES = 'setTextStyles';
  SET_USER_TEXT_STYLES = 'setUserTextStyles';
  SET_USER_IMAGE_STYLES = 'setUserImageStyles';
  UPDATE_SAVING_STATUS = 'updateSavingStatus';
  UPDATE_MEDIA_SIDEBAR_OPEN = 'updateMediaSidebarOpen';
  UPDATE_DISABLED_TOOLBAR_ITEMS = 'updateDisabledToolbarItems';
  SET_LOADING_STATE = 'setLoadingState';
  SET_FONTS = 'setFonts';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _MUTATES = new MutationClass();

export const MUTATES = new MutationClass(
  prefixObjectValue(_MUTATES, MODULE_NAME)
);

export default {
  _GETTERS,
  _MUTATES
};
