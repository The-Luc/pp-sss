import { cloneDeep } from 'lodash';

export const setBookId = (state, { bookId }) => {
  state.book.id = bookId;
};

export const setBook = (state, { book }) => {
  state.book = book;
};

export const setBookInfo = (state, { info }) => {
  state.book = { ...cloneDeep(state.book), ...info };
};
