export const MODULE_NAME = 'book';

const _GETTERS = {
  SECTIONS: 'sections',
};

export const GETTERS = {
  SECTIONS: `${MODULE_NAME}/${_GETTERS.SECTIONS}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  UPDATE_SECTIONS: 'updateSections',
  UPDATE_SHEETS: 'updateSheets',
  UPDATE_SHEET_POSITION: 'updateSheetPosition'
};

export const MUTATES = {
  UPDATE_SECTIONS: `${MODULE_NAME}/${_MUTATES.UPDATE_SECTIONS}`,
  UPDATE_SHEETS: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEETS}`,
  UPDATE_SHEET_POSITION: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_POSITION}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
