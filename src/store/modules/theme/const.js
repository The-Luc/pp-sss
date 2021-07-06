export const MODULE_NAME = 'theme';

const _GETTERS = {
  GET_PRINT_THEMES: 'getPrintThemes',
  GET_PRINT_LAYOUTS_BY_THEME_ID: 'getPrintLayouts',
  GET_PRINT_LAYOUT_BY_TYPE: 'getPrintLayoutByType',
  GET_DIGITAL_LAYOUT_BY_TYPE: 'getDigitalLayoutByType'
};

export const GETTERS = {
  GET_PRINT_THEMES: `${MODULE_NAME}/${_GETTERS.GET_PRINT_THEMES}`,
  GET_PRINT_LAYOUTS_BY_THEME_ID: `${MODULE_NAME}/${_GETTERS.GET_PRINT_LAYOUTS_BY_THEME_ID}`,
  GET_PRINT_LAYOUT_BY_TYPE: `${MODULE_NAME}/${_GETTERS.GET_PRINT_LAYOUT_BY_TYPE}`,
  GET_DIGITAL_LAYOUT_BY_TYPE: `${MODULE_NAME}/${_GETTERS.GET_DIGITAL_LAYOUT_BY_TYPE}`
};

const _ACTIONS = {
  GET_PRINT_THEMES: 'getPrintThemes'
};

export const ACTIONS = {
  GET_PRINT_THEMES: `${MODULE_NAME}/${_ACTIONS.GET_PRINT_THEMES}`
};

const _MUTATES = {
  PRINT_THEMES: 'printThemes',
  PRINT_LAYOUTS: 'printLayouts',
  DIGITAL_LAYOUTS: 'digitalLayouts'
};

export const MUTATES = {
  PRINT_THEMES: `${MODULE_NAME}/${_MUTATES.PRINT_THEMES}`,
  PRINT_LAYOUTS: `${MODULE_NAME}/${_MUTATES.PRINT_LAYOUTS}`,
  DIGITAL_LAYOUTS: `${MODULE_NAME}/${_MUTATES.DIGITAL_LAYOUTS}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
