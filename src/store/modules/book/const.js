export const MODULE_NAME = 'book';

const _GETTERS = {
  BOOK_DETAIL: 'bookDetail',
  BOOK_ID: 'bookId',
  SECTIONS: 'sections'
};

export const GETTERS = {
  SECTIONS: `${MODULE_NAME}/${_GETTERS.SECTIONS}`,
  BOOK_DETAIL: `${MODULE_NAME}/${_GETTERS.BOOK_DETAIL}`,
  BOOK_ID: `${MODULE_NAME}/${_GETTERS.BOOK_ID}`
};

const _ACTIONS = {
  GET_BOOK: 'getBook'
};

export const ACTIONS = {
  GET_BOOK: `${MODULE_NAME}/${_ACTIONS.GET_BOOK}`
};

const _MUTATES = {
  UPDATE_SECTIONS: 'updateSections',
  UPDATE_SHEETS: 'updateSheets',
  UPDATE_SHEET_POSITION: 'updateSheetPosition',
  GET_BOOK_SUCCESS: 'getBookSuccess'
};

export const MUTATES = {
  GET_BOOK_SUCCESS: `${MODULE_NAME}/${_MUTATES.GET_BOOK_SUCCESS}`,
  UPDATE_SECTIONS: `${MODULE_NAME}/${_MUTATES.UPDATE_SECTIONS}`,
  UPDATE_SHEETS: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEETS}`,
  UPDATE_SHEET_POSITION: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_POSITION}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
