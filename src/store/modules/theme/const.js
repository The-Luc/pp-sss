export const MODULE_NAME = 'theme';

const _GETTERS = {
  GET_THEMES: 'getThemes',
  GET_LAYOUTS: 'getLayouts',
  GET_LAYOUT_BY_TYPE: 'getLayoutByType'
};

export const GETTERS = {
  GET_THEMES: `${MODULE_NAME}/${_GETTERS.GET_THEMES}`,
  GET_LAYOUTS: `${MODULE_NAME}/${_GETTERS.GET_LAYOUTS}`,
  GET_LAYOUT_BY_TYPE: `${MODULE_NAME}/${_GETTERS.GET_LAYOUT_BY_TYPE}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {};

export const MUTATES = {};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
