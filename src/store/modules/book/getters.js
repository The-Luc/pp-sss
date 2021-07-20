import moment from 'moment';

import { DATE_FORMAT, MOMENT_TYPE } from '@/common/constants';
import BOOK from './const';
import {
  getDiffDaysFOM,
  getDiffMonths,
  getDiffDaysFOMToEOM,
  isEmpty
} from '@/common/utils';

export const getters = {
  [BOOK._GETTERS.TOTAL_INFO]: ({ book }) => {
    return {
      totalPages: book.totalPages,
      totalSheets: book.totalSheets,
      totalScreens: book.totalScreens
    };
  },
  [BOOK._GETTERS.BOOK_DETAIL]: ({ book }) => book,
  [BOOK._GETTERS.BOOK_ID]: ({ book }) => book.id,
  [BOOK._GETTERS.SECTIONS]: ({ sectionIds, sections, sheets }) => {
    return sectionIds.map(id => {
      const sheetItems = sections[id].sheetIds.map(sheetId => sheets[sheetId]);

      return {
        ...sections[id],
        sheets: sheetItems
      };
    });
  },
  [BOOK._GETTERS.SECTIONS_NO_SHEET]: ({ sectionIds, sections }) => {
    return sectionIds.map(id => ({
      id,
      name: sections[id].name,
      color: sections[id].color
    }));
  },
  [BOOK._GETTERS.TOTAL_SECTION]: ({ sectionIds }) => {
    return sectionIds.length;
  },
  [BOOK._GETTERS.GET_MAX_PAGE]: ({ book }) => {
    return book.numberMaxPages;
  },
  [BOOK._GETTERS.IMPORTANT_DATES_INFO]: ({ book }) => {
    const { releaseDate, deliveryDate } = book;

    return { releaseDate, deliveryDate };
  },
  [BOOK._GETTERS.SPECIFICATION_INFO]: ({ book }) => {
    const {
      coverOption,
      numberMaxPages,
      estimatedQuantity,
      deliveryOption
    } = book;

    const { min: minQuantity, max: maxQuantity } = isEmpty(estimatedQuantity)
      ? {}
      : estimatedQuantity;

    return {
      coverOption,
      numberMaxPages,
      minQuantity,
      maxQuantity,
      deliveryOption
    };
  },
  [BOOK._GETTERS.SALE_INFO]: ({ book }) => {
    const { booksSold, fundraisingEarned } = book;

    return { booksSold, fundraisingEarned };
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
  [BOOK._GETTERS.TOTAL_MONTH_SHOW_ON_CHART]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    return getDiffMonths(createdDate, deliveryDate);
  },
  [BOOK._GETTERS.TOTAL_DAYS_SHOW_ON_CHART]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    const endTime = moment(deliveryDate, DATE_FORMAT.BASE).add(
      1,
      MOMENT_TYPE.MONTH
    );

    return getDiffDaysFOMToEOM(createdDate, endTime.format(DATE_FORMAT.BASE));
  },
  [BOOK._GETTERS.SALE_DATE_FROM_BEGINNING]: ({ book }) => {
    const { createdDate, saleDate } = book;

    return getDiffDaysFOM(createdDate, saleDate);
  },
  [BOOK._GETTERS.RELEASE_DATE_FROM_BEGINNING]: ({ book }) => {
    const { createdDate, releaseDate } = book;

    return getDiffDaysFOM(createdDate, releaseDate);
  },
  [BOOK._GETTERS.CREATED_DATE_FROM_BEGINNING]: ({ book }) => {
    const { createdDate } = book;

    return getDiffDaysFOM(createdDate, createdDate);
  },
  [BOOK._GETTERS.DELIVERY_DATE_FROM_BEGINNING]: ({ book }) => {
    const { createdDate, deliveryDate } = book;

    return getDiffDaysFOM(createdDate, deliveryDate);
  },
  [BOOK._GETTERS.SECTION_ID]: ({ sectionId }) => {
    return sectionId;
  },
  [BOOK._GETTERS.DUE_DATE_FROM_BEGINNING]: ({ book }) => dueDate => {
    const { createdDate } = book;

    return getDiffDaysFOM(createdDate, dueDate);
  }
};
