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
  TRIGGER_TEXT_CHANGE = 'triggerTextChange';
  USER = 'getCurrentUser';
  TRIGGER_SHAPE_CHANGE = 'triggerShapeChange';
  TRIGGER_CLIPART_CHANGE = 'triggerClipArtChange';
  GENERAL_INFO = 'getGeneralInfo';
  SAVED_TEXT_STYLES = 'savedTextStyles';
  SAVED_IMAGE_STYLES = 'savedImageStyles';
  SAVING_STATUS = 'savingStatus';
  IS_OPEN_PHOTO_SIDEBAR = 'isOpenPhotoSidebar';
  IS_PHOTO_VISITED = 'isPhotoVisited';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _GETTERS = new GetterClass();

export const GETTERS = new GetterClass(
  prefixObjectValue(_GETTERS, MODULE_NAME)
);

class ActionClass extends BaseObject {
  SAVE_TEXT_STYLE = 'saveTextStyle';
  GET_SAVED_TEXT_STYLES = 'getSavedTextStyles';
  SAVE_IMAGE_STYLE = 'saveImageStyle';
  GET_SAVED_IMAGE_STYLES = 'getSavedImageStyles';

  constructor(props) {
    super(props);
    this._set(props);
  }
}
const _ACTIONS = new ActionClass();

export const ACTIONS = new ActionClass(
  prefixObjectValue(_ACTIONS, MODULE_NAME)
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
  UPDATE_TRIGGER_TEXT_CHANGE = 'triggerTextChange';
  SET_USER = 'setCurrentUser';
  UPDATE_TRIGGER_SHAPE_CHANGE = 'triggerShapeChange';
  UPDATE_TRIGGER_CLIPART_CHANGE = 'triggerClipArtChange';
  SET_GENERAL_INFO = 'setGeneralInfo';
  SET_SAVED_TEXT_STYLES = 'setSavedTextStyle';
  SET_SAVED_IMAGE_STYLES = 'setSavedImageStyle';
  SET_SAVED_TEXT_STYLE = 'setSavedTextStyle';
  SET_SAVED_IMAGE_STYLE = 'setSavedImageStyle';
  UPDATE_SAVING_STATUS = 'updateSavingStatus';
  TOGGLE_PHOTO_SIDEBAR = 'togglePhotoSidebar';
  SET_PHOTO_VISITED = 'setPhotoVisited';

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
  _ACTIONS,
  _MUTATES
};
