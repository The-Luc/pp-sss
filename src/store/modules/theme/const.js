export const MODULE_NAME = 'theme';

const _GETTERS = {
  GET_THEMES: 'getThemes',
  GET_LAYOUTS: 'getLayouts'
};

export const GETTERS = {
  GET_THEMES: `${MODULE_NAME}/${_GETTERS.GET_THEMES}`,
  GET_LAYOUTS: `${MODULE_NAME}/${_GETTERS.GET_LAYOUTS}`
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
