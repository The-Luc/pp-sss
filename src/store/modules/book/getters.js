import BOOK from './const';

export const getters = {
  [BOOK._GETTERS.BOOK_DETAIL]: ({ book }) => book,
  [BOOK._GETTERS.BOOK_ID]: ({ book }) => book.id
};
