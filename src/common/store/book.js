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

export const isPhotoVisited = ({ book }) => book.isPhotoVisited;

export const setIsPhotoVisited = (state, { isPhotoVisited }) => {
  state.book.isPhotoVisited = isPhotoVisited;
};
