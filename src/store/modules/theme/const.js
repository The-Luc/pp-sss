export const MODULE_NAME = 'theme';

const _GETTERS = {
  GET_PRINT_THEMES: 'getPrintThemes',
  GET_LAYOUTS: 'getLayouts',
  GET_LAYOUT_BY_TYPE: 'getLayoutByType'
};

export const GETTERS = {
  GET_PRINT_THEMES: `${MODULE_NAME}/${_GETTERS.GET_PRINT_THEMES}`,
  GET_LAYOUTS: `${MODULE_NAME}/${_GETTERS.GET_LAYOUTS}`,
  GET_LAYOUT_BY_TYPE: `${MODULE_NAME}/${_GETTERS.GET_LAYOUT_BY_TYPE}`
};

const _ACTIONS = {
  GET_PRINT_THEMES: 'getPrintThemes'
};

export const ACTIONS = {
  GET_PRINT_THEMES: `${MODULE_NAME}/${_GETTERS.GET_PRINT_THEMES}`
};

const _MUTATES = {
  UPDATE_PRINT_THEMES: 'updatePrintThemes'
};

export const MUTATES = {
  UPDATE_PRINT_THEMES: `${MODULE_NAME}/${_MUTATES.UPDATE_PRINT_THEMES}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
