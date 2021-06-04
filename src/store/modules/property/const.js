export const MODULE_NAME = 'property';

const _GETTERS = {
  TEXT_STYLE: 'getTextStyle',
  TEXT_PROPERTY: 'getTextProperty'
};

export const GETTERS = {
  TEXT_STYLE: `${MODULE_NAME}/${_GETTERS.TEXT_STYLE}`,
  TEXT_PROPERTY: `${MODULE_NAME}/${_GETTERS.TEXT_PROPERTY}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  SET_TEXT_STYLE: 'setTextStyle',
  SET_TEXT_PROPERTY: 'setTextProperty'
};

export const MUTATES = {
  SET_TEXT_STYLE: `${MODULE_NAME}/${_MUTATES.SET_TEXT_STYLE}`,
  SET_TEXT_PROPERTY: `${MODULE_NAME}/${_MUTATES.SET_TEXT_PROPERTY}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
