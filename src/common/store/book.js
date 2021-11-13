import { cloneDeep } from 'lodash';
import moment from 'moment';

import { isEmpty } from '../utils';

import { MOMENT_TYPE, DATE_FORMAT } from '../constants';

const getReleaseDate = deliveryDate => {
  if (isEmpty(deliveryDate)) return '';

  return moment(deliveryDate, DATE_FORMAT.BASE)
    .add(-14, MOMENT_TYPE.DAY)
    .format(DATE_FORMAT.BASE);
};

export const setBookId = (state, { bookId }) => {
  state.book.id = bookId;
};

export const setBook = (state, { book }) => {
  book.releaseDate = getReleaseDate(book.deliveryDate);

  state.book = book;
};

export const setBookInfo = (state, { info }) => {
  state.book = { ...cloneDeep(state.book), ...info };
};

export const isPhotoVisited = ({ book }) => book.isPhotoVisited;

export const setIsPhotoVisited = (state, { isPhotoVisited }) => {
  state.book.isPhotoVisited = isPhotoVisited;
};

export const defaultThemeId = ({ book }) => book.defaultThemeId;

export const communityId = ({ book }) => book.communityId;
