export const MODULE_NAME = 'app';

const _GETTERS = {
  IS_OPEN_MODAL: 'isOpenModal',
  MODAL_DATA: 'modalData',
  SECTION_SELECTED: 'sectionSelected',
  SELECTED_OBJECT_TYPE: 'selectedObjectType',
  IS_OPEN_MENU_PROPERTIES: 'isOpenMenuProperties',
  SELECTED_TOOL_NAME: 'selectedToolName',
  COLOR_PICKER_PRESETS: 'colorPickerPresets',
  IS_PROMPT: 'isPrompt',
  HAS_ACTIVE_OBJECTS: 'hasActiveObjects',
  PROPERTIES_OBJECT_TYPE: 'getPropertiesObjectType',
  TAB_SELECTED_OBJECT_ID: 'getSelectedObjectIdForTab',
  INFO_BAR: 'getInfoBar',
  ZOOM: 'getZoom'
};

export const GETTERS = {
  IS_OPEN_MODAL: `${MODULE_NAME}/${_GETTERS.IS_OPEN_MODAL}`,
  MODAL_DATA: `${MODULE_NAME}/${_GETTERS.MODAL_DATA}`,
  SECTION_SELECTED: `${MODULE_NAME}/${_GETTERS.SECTION_SELECTED}`,
  SELECTED_OBJECT_TYPE: `${MODULE_NAME}/${_GETTERS.SELECTED_OBJECT_TYPE}`,
  IS_OPEN_MENU_PROPERTIES: `${MODULE_NAME}/${_GETTERS.IS_OPEN_MENU_PROPERTIES}`,
  SELECTED_TOOL_NAME: `${MODULE_NAME}/${_GETTERS.SELECTED_TOOL_NAME}`,
  COLOR_PICKER_PRESETS: `${MODULE_NAME}/${_GETTERS.COLOR_PICKER_PRESETS}`,
  IS_PROMPT: `${MODULE_NAME}/${_GETTERS.IS_PROMPT}`,
  HAS_ACTIVE_OBJECTS: `${MODULE_NAME}/${_GETTERS.HAS_ACTIVE_OBJECTS}`,
  PROPERTIES_OBJECT_TYPE: `${MODULE_NAME}/${_GETTERS.PROPERTIES_OBJECT_TYPE}`,
  TAB_SELECTED_OBJECT_ID: `${MODULE_NAME}/${_GETTERS.TAB_SELECTED_OBJECT_ID}`,
  INFO_BAR: `${MODULE_NAME}/${_GETTERS.INFO_BAR}`,
  ZOOM: `${MODULE_NAME}/${_GETTERS.ZOOM}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  TOGGLE_MODAL: 'toggleModal',
  SET_SELECTION_SELECTED: 'setSectionSelected',
  SET_OBJECT_TYPE_SELECTED: 'setObjectTypeSelected',
  TOGGLE_MENU_PROPERTIES: 'toggleMenuProperties',
  RESET_PRINT_CONFIG: 'resetPrintConfig',
  SET_TOOL_NAME_SELECTED: 'setToolNameSelected',
  SET_COLOR_PICKER_PRESETS: 'setColorPickerPresets',
  SET_IS_PROMPT: 'setIsPrompt',
  TOGGLE_ACTIVE_OBJECTS: 'toggleActiveObjects',
  SET_PROPERTIES_OBJECT_TYPE: 'setPropertiesObjectType',
  SET_INFO_BAR: 'setInfoBarData'
};

export const MUTATES = {
  TOGGLE_MODAL: `${MODULE_NAME}/${_MUTATES.TOGGLE_MODAL}`,
  SET_SELECTION_SELECTED: `${MODULE_NAME}/${_MUTATES.SET_SELECTION_SELECTED}`,
  SET_OBJECT_TYPE_SELECTED: `${MODULE_NAME}/${_MUTATES.SET_OBJECT_TYPE_SELECTED}`,
  TOGGLE_MENU_PROPERTIES: `${MODULE_NAME}/${_MUTATES.TOGGLE_MENU_PROPERTIES}`,
  RESET_PRINT_CONFIG: `${MODULE_NAME}/${_MUTATES.RESET_PRINT_CONFIG}`,
  SET_TOOL_NAME_SELECTED: `${MODULE_NAME}/${_MUTATES.SET_TOOL_NAME_SELECTED}`,
  SET_COLOR_PICKER_PRESETS: `${MODULE_NAME}/${_MUTATES.SET_COLOR_PICKER_PRESETS}`,
  SET_IS_PROMPT: `${MODULE_NAME}/${_MUTATES.SET_IS_PROMPT}`,
  TOGGLE_ACTIVE_OBJECTS: `${MODULE_NAME}/${_MUTATES.TOGGLE_ACTIVE_OBJECTS}`,
  SET_PROPERTIES_OBJECT_TYPE: `${MODULE_NAME}/${_MUTATES.SET_PROPERTIES_OBJECT_TYPE}`,
  SET_INFO_BAR: `${MODULE_NAME}/${_MUTATES.SET_INFO_BAR}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
