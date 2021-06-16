export const MODULE_NAME = 'theme';

const _GETTERS = {
  GET_THEMES: 'getThemes',
  GET_PRINT_LAYOUTS: 'getPrintLayouts',
  GET_PRINT_LAYOUT_BY_TYPE: 'getPrintLayoutByType',
  IS_PRINT_LAYOUT_EMPTY: 'isPrintLayoutEmpty'
};

export const GETTERS = {
  GET_THEMES: `${MODULE_NAME}/${_GETTERS.GET_THEMES}`,
  GET_PRINT_LAYOUTS: `${MODULE_NAME}/${_GETTERS.GET_PRINT_LAYOUTS}`,
  GET_PRINT_LAYOUT_BY_TYPE: `${MODULE_NAME}/${_GETTERS.GET_PRINT_LAYOUT_BY_TYPE}`,
  IS_PRINT_LAYOUT_EMPTY: `${MODULE_NAME}/${_GETTERS.IS_PRINT_LAYOUT_EMPTY}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  PRINT_LAYOUTS: 'printLayouts'
};

export const MUTATES = {
  PRINT_LAYOUTS: `${MODULE_NAME}/${_MUTATES.PRINT_LAYOUTS}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
