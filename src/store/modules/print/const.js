export const MODULE_NAME = 'print';

const _GETTERS = {
  TEXT_STYLE: 'getTextStyle',
  TEXT_STYLE_ID: 'getTextStyleId'
};

export const GETTERS = {
  TEXT_STYLE: `${MODULE_NAME}/${_GETTERS.TEXT_STYLE}`,
  TEXT_STYLE_ID: `${MODULE_NAME}/${_GETTERS.TEXT_STYLE_ID}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  SET_TEXT_STYLE: 'setTextStyle'
};

export const MUTATES = {
  SET_TEXT_STYLE: `${MODULE_NAME}/${_MUTATES.SET_TEXT_STYLE}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
