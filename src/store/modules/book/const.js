export const MODULE_NAME = 'book';

const _GETTERS = {
  SECTION_INDEX: 'sectionIndex',
  SECTIONS: 'sections',
  SHEETS: 'sheets',
  SHEETS_BY_SECTION_INDEX: 'sheetsBySectionIndex'
};

export const GETTERS = {
  SECTION_INDEX: `${MODULE_NAME}/${_GETTERS.SECTION_INDEX}`,
  SECTIONS: `${MODULE_NAME}/${_GETTERS.SECTIONS}`,
  SHEETS: `${MODULE_NAME}/${_GETTERS.SHEETS}`,
  SHEETS_BY_SECTION_INDEX: `${MODULE_NAME}/${_GETTERS.SHEETS_BY_SECTION_INDEX}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  UPDATE_SECTIONS: 'updateSections',
  UPDATE_SHEETS: 'updateSheets'
};

export const MUTATES = {
  UPDATE_SECTIONS: `${MODULE_NAME}/${_MUTATES.UPDATE_SECTIONS}`,
  UPDATE_SHEETS: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEETS}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
