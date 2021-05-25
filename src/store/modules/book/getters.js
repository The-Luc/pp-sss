import moment from 'moment';

import BOOK from './const';

export const getters = {
  [BOOK._GETTERS.GET_SECTIONS]: ({ book }) => {
    return book.sections.sort((firstEl, secondEl) => {
      return firstEl.order - secondEl.order;
    });
  },
  [BOOK._GETTERS.GET_TOTAL_INFO]: ({ book }) => {
    return {
      totalPages: book.totalPages,
      totalSheets: book.totalSheets,
      totalScreens: book.totalScreens
    };
  },
  [BOOK._GETTERS.BOOK_DETAIL]: ({ book }) => book,
  [BOOK._GETTERS.BOOK_ID]: ({ book }) => book.id,
  [BOOK._GETTERS.SECTIONS]: ({ book }) => {
    return book.sections;
  },
  [BOOK._GETTERS.GET_TOTAL_SECTIONS]: ({ book }) => {
    return book.sections.length;
  },
  [BOOK._GETTERS.GET_MAX_PAGE]: ({ book }) => {
    return book.numberMaxPages;
  },
  [BOOK._GETTERS.BOOK_DATES]: ({ book }) => {
    const { createdDate, saleDate, releaseDate, deliveryDate } = book;

    return {
      createdDate,
      saleDate,
      releaseDate,
      deliveryDate
    };
  },
  [BOOK._GETTERS.GET_PAGE_SELECTED]: ({ pageSelected }) => {
    return pageSelected;
  },
  [BOOK._GETTERS.IS_SELECTED_PRINT_THEME]: ({ book }) => {
    return !!book.printData.theme;
  },
  [BOOK._GETTERS.TOTAL_MONTH_SHOW_ON_CHART]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    const beginTime = moment(createdDate, 'MM/DD/YY');
    const endTime = moment(deliveryDate, 'MM/DD/YY')
      .add(1, 'M')
      .set('date', beginTime.date());

    return endTime.diff(beginTime, 'months', false) + 1;
  }
};
