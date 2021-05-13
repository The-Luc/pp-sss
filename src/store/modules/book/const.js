export const MODULE_NAME = 'book';

const _GETTERS = {
  BOOK_DETAIL: 'bookDetail',
  BOOK_ID: 'bookId'
};

export const GETTERS = {
  BOOK_DETAIL: `${MODULE_NAME}/${_GETTERS.BOOK_DETAIL}`,
  BOOK_ID: `${MODULE_NAME}/${_GETTERS.BOOK_ID}`
};

const _ACTIONS = {
  GET_BOOK: 'getBook'
};

export const ACTIONS = {
  GET_BOOK: `${MODULE_NAME}/${_ACTIONS.GET_BOOK}`,
  TEST: _ACTIONS.GET_BOOK
};

const _MUTATES = {
  GET_BOOK_SUCCESS: 'getBookSuccess'
};

export const MUTATES = {
  GET_BOOK_SUCCESS: `${MODULE_NAME}/${_MUTATES.GET_BOOK_SUCCESS}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
