import moment from 'moment';
import { pick } from 'lodash';

import { DATE_FORMAT, MOMENT_TYPE, OBJECT_TYPE } from '@/common/constants';
import BOOK from './const';
import {
  isEmpty,
  getAllSheets,
  getDiffDaysFOM,
  getDiffMonths,
  getDiffDaysFOMToEOM
} from '@/common/utils';

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
  [BOOK._GETTERS.SECTION_ID]: ({ sectionId }) => {
    return sectionId;
  },
  [BOOK._GETTERS.DUE_DATE_FROM_BEGINNING]: ({ book }) => dueDate => {
    const { createdDate } = book;

    return getDiffDaysFOM(createdDate, dueDate);
  },
  [BOOK._GETTERS.GET_OBJECTS_BY_SHEET_ID]: ({ book, objects }) => sheetId => {
    const sheets = getAllSheets(book.sections);
    const sheet = sheets.find(s => s.id === sheetId);
    const objIds = [];
    sheet?.printData?.layout?.pages?.forEach(page => {
      page?.objects?.forEach(objId => {
        objIds.push(objId);
      });
    });
    return pick(objects, [...objIds]);
  },
  [BOOK._GETTERS.SELECTED_OBJECT_ID]: ({ objectSelectedId }) =>
    objectSelectedId,
  [BOOK._GETTERS.OBJECT_BY_ID]: ({ objects }) => id => objects[id],
  [BOOK._GETTERS.PROP_OBJECT_BY_ID]: ({ objects }) => ({ id, prop }) => {
    const data = objects[id]?.property[prop];
    return data || data === 0 ? objects[id]?.property[prop] : null;
  },
  [BOOK._GETTERS.TRIGGER_TEXT_CHANGE]: ({ triggerTextChange }) =>
    triggerTextChange,
  [BOOK._GETTERS.SHEET_BACKGROUNDS]: ({ book, objects }) => sheetId => {
    const sheets = getAllSheets(book.sections);
    const sheet = sheets.find(s => s.id === sheetId);

    const pageData = sheet?.printData?.layout?.pages || null;

    if (isEmpty(pageData)) return [];

    const firstId = isEmpty(pageData[0].objects) ? '' : pageData[0].objects[0];
    const secondId =
      pageData.length > 1 && !isEmpty(pageData[1].objects)
        ? pageData[1].objects[0]
        : '';

    const existedBackgroundIds = [firstId, secondId].filter(id => {
      if (isEmpty(id)) return false;

      const element = objects[id];

      if (isEmpty(element)) return false;

      const isBackground = element.type === OBJECT_TYPE.BACKGROUND;
      const backgroundType = isBackground ? element.property.type : '';

      return !isEmpty(backgroundType);
    });

    return existedBackgroundIds.map(id => objects[id]);
  },
  [BOOK._GETTERS.SHEET_TYPE]: ({ book }) => sheetId => {
    const sheets = getAllSheets(book.sections);
    const sheet = sheets.find(s => s.id === sheetId);

    return isEmpty(sheet) ? '' : sheet.type;
  },
  [BOOK._GETTERS.TRIGGER_BACKGROUND_CHANGE]: ({ triggerBackgroundChange }) =>
    triggerBackgroundChange
};
