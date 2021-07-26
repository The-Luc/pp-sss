import {
  BookDetail,
  Section,
  BookManagerDetail,
  BookPrintDetail,
  BookDigitalDetail,
  SheetPrintData,
  SheetDigitalData
} from '@/common/models';

import { cloneDeep } from 'lodash';

export const getBookDetail = bookId => {
  // TODO: remove when integrate API
  bookId;

  return new Promise(resolve => {
    const { book, sheets, sections, objects } = window.data;
    const sectionData = cloneDeep(sections);
    const sheetData = cloneDeep(sheets);

    const sectionIds = [];
    const sectionsAsObject = {};
    const sheetsAsObject = {};

    sectionData.forEach(section => {
      const { id } = section;
      sectionsAsObject[id] = new Section(section);
      sectionIds.push(id);
    });

    // TODO: define a general Sheet class
    sheetData.forEach(sheet => {
      sheetsAsObject[sheet.id] = sheet;
    });

    resolve({
      book: new BookDetail(book),
      sectionIds,
      sections: sectionData,
      sheets: sheetData,
      sectionsAsObject,
      sheetsAsObject,
      objects
    });
  });
};

/**
 * Temporary code, will be replaced when integrating with API
 */
export const getBookManager = async bookId => {
  const {
    book,
    sectionIds,
    sectionsAsObject,
    sheetsAsObject
  } = await bookService.getBook(bookId);

  const bookData = new BookManagerDetail(book);

  return {
    book: bookData,
    sectionIds,
    sections: sectionsAsObject,
    sheets: sheetsAsObject
  };
};

export const getBookPrint = async bookId => {
  const {
    book,
    sectionIds,
    sectionsAsObject,
    sheets,
    sections
  } = await bookService.getBook(bookId);
  const bookPrint = new BookPrintDetail({
    ...book,
    pageInfo: book.printData.pageInfo,
    themeId: book.printData.themeId
  });

  const sheetsPrint = sheets.map(s => new SheetPrintData(s));
  const sheetsAsObject = {};
  sheetsPrint.forEach(sheet => (sheetsAsObject[sheet.id] = sheet));

  return {
    book: bookPrint,
    sectionIds,
    sections: sectionsAsObject,
    sheets: sheetsAsObject,
    sectionsAsArray: sections
  };
};

export const getBookDigital = async bookId => {
  const {
    book,
    sectionIds,
    sectionsAsObject,
    sheets,
    sections
  } = await bookService.getBook(bookId);
  const bookDigital = new BookDigitalDetail(book);

  const sheetsDigital = sheets.map(s => new SheetDigitalData(s));
  const sheetsAsObject = {};
  sheetsDigital.forEach(sheet => (sheetsAsObject[sheet.id] = sheet));

  return {
    book: bookDigital,
    sectionIds,
    sections: sectionsAsObject,
    sheets: sheetsAsObject,
    sectionsAsArray: sections
  };
};

const bookService = {
  getBook: getBookDetail,
  getBookPrint,
  getBookDigital,
  updateBook: (bookId, props) => {
    // TODO: remove when integrate API
    bookId;

    return new Promise(resolve => {
      window.data.book._set(props);
      resolve({
        data: window.data.book,
        isSuccess: true
      });
    });
  },
  updateTitle: async (bookId, title) => {
    const response = await bookService.updateBook(bookId, { title });
    return {
      data: response.data,
      isSuccess: true
    };
  },
  updateSection: (bookId, sectionId, data) => {
    // TODO: remove when integrate API
    bookId;

    window.data.sections.forEach(section => {
      if (section.id === sectionId) {
        section._set(data);
      }
    });
    return Promise.resolve({
      isSuccess: true,
      data: {
        bookId,
        sectionId,
        data
      }
    });
  },
  getSections: async bookId => {
    const { sections } = await bookService.getBook(bookId);

    return { sections };
  },
  getSection: async sectionId => {
    const { sectionsAsObject } = await bookService.getBook();

    const section = sectionsAsObject[sectionId] || null;
    return { section };
  },
  getSheets: async sectionId => {
    const { sheets } = await bookService.getBook();

    const sheetsBySection = sheets.filter(
      sheet => sheet.sectionId === sectionId
    );
    return { sheets: sheetsBySection };
  },
  getSheet: async (sectionId, sheetId) => {
    const { sheetsAsObject } = await bookService.getBook();
    const sheetObject = sheetsAsObject[sheetId] || {};

    const sheet = sheetObject.sectionId === sectionId ? sheetObject : null;
    return { sheet };
  },
  getObjectBySheet: async (sectionId, sheetId) => {
    const { objects } = await bookService.getBook();

    return objects[sheetId];
  }
};

export default {
  ...bookService,
  getBookManager
};
