import moment from 'moment';

import { getAllSheets, getDiffDays } from '@/common/utils';
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
  [BOOK._GETTERS.PRINT_THEME_SELECTED_ID]: ({ book }) => {
    return book.printData.themeId;
  },
  [BOOK._GETTERS.TOTAL_MONTH_SHOW_ON_CHART]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    const beginTime = moment(createdDate, 'MM/DD/YY');
    const endTime = moment(deliveryDate, 'MM/DD/YY')
      .add(1, 'M')
      .set('date', beginTime.date());

    return endTime.diff(beginTime, 'months', false) + 1;
  },
  [BOOK._GETTERS.TOTAL_DAYS_SHOW_ON_CHART]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    const beginTime = moment(createdDate, 'MM/DD/YY').set('date', 1);
    const endTime = moment(deliveryDate, 'MM/DD/YY').add(1, 'M');

    endTime.set('date', endTime.daysInMonth());

    return endTime.diff(beginTime, 'days', false) + 1;
  },
  [BOOK._GETTERS.SALE_DAY_FROM_BEGINNING]: ({ book }) => {
    const { createdDate, saleDate } = book;

    return getDiffDays(createdDate, saleDate);
  },
  [BOOK._GETTERS.RELEASE_DAY_FROM_BEGINNING]: ({ book }) => {
    const { createdDate, releaseDate } = book;

    return getDiffDays(createdDate, releaseDate);
  },
  [BOOK._GETTERS.CREATED_DAY_FROM_BEGINNING]: ({ book }) => {
    const { createdDate } = book;

    return getDiffDays(createdDate, createdDate);
  },
  [BOOK._GETTERS.DELIVERY_DAY_FROM_BEGINNING]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    return getDiffDays(createdDate, deliveryDate);
  },
  [BOOK._GETTERS.GET_TEXT_PROPERTIES]: ({ textProperties }) => {
    return textProperties;
  },
  [BOOK._GETTERS.SHEET_LAYOUT]: ({ book }) => sheetId => {
    const sheets = getAllSheets(book.sections);
    const sheet = sheets.find(s => s.id === sheetId);
    return sheet?.printData?.layout;
  },
  [BOOK._GETTERS.SHEET_THEME]: ({ book }) => sheetId => {
    const sheets = getAllSheets(book.sections);
    const sheet = sheets.find(s => s.id === sheetId);
    return sheet?.printData?.theme;
  },
  [BOOK._GETTERS.SHEET_IS_VISITED]: ({ book }) => sheetId => {
    const sheets = getAllSheets(book.sections);
    const sheet = sheets.find(s => s.id === sheetId);
    return sheet?.isVisited;
  },
  [BOOK._GETTERS.SECTION_ID]: ({ sectionId }) => {
    return sectionId;
  }
};
