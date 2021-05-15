import BOOK from './const';
import bookService from '@/api/book';

export const actions = {
  [BOOK._ACTIONS.GET_BOOK]({ commit }, bookId) {
    const res = bookService.getBook(bookId);
    commit(BOOK._MUTATES.GET_BOOK_SUCCESS, res);
  }
};
