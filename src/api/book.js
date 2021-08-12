import {
  BookDetail,
  Section,
  BookManagerDetail,
  BookPrintDetail,
  BookDigitalDetail,
  SheetPrintData,
  SheetDigitalDetail
} from '@/common/models';
import { SheetEntity } from '@/common/models/entities';

import { cloneDeep } from 'lodash';

export const getBookDetail = bookId => {
  // TODO: remove when integrate API
  bookId;

  return new Promise(resolve => {
    const { book } = cloneDeep(window.data);
    const sectionData = book.sections;
    const isPhotoVisited = book.isPhotoVisited;
    const sheetData = [];

    const sectionIds = [];
    const sectionsAsObject = {};
    const sheetsAsObject = {};

    sectionData.forEach(section => {
      const { id } = section;
      const sheetIds = [];
      sectionIds.push(id);

      section.sheets.forEach(sheet => {
        sheetIds.push(sheet.id);

        sheetData.push(new SheetEntity(sheet));
      });

      // adding sheetIds to section
      section.sheetIds = sheetIds;
      sectionsAsObject[id] = new Section(section);
    });

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
      isPhotoVisited
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
    sheets,
    sectionsAsObject,
    isPhotoVisited
  } = await bookService.getBook(bookId);

  const bookData = new BookManagerDetail(book);

  // TODO: define sheet class for manager
  const printSheets = {};
  sheets.forEach(sheet => {
    const newSheet = new SheetPrintData({
      ...sheet,
      ...sheet.printData
    });

    printSheets[newSheet.id] = newSheet;
  });

  return {
    book: bookData,
    sectionIds,
    sections: sectionsAsObject,
    sheets: printSheets,
    isPhotoVisited
  };
};

export const getBookPrint = async bookId => {
  const {
    book,
    sectionsAsObject,
    sheets,
    sections
  } = await bookService.getBook(bookId);

  const bookPrint = new BookPrintDetail({
    ...book,
    pageInfo: book.printData.pageInfo,
    themeId: book.printData.themeId
  });

  const sheetsPrint = sheets.map(
    s =>
      new SheetPrintData({
        ...s,
        ...s.printData
      })
  );
  const sheetsAsObject = {};
  sheetsPrint.forEach(sheet => (sheetsAsObject[sheet.id] = sheet));

  const objects = {};
  sheets.forEach(s => (objects[s.id] = s.printData.objects));

  return {
    book: bookPrint,
    sections: sectionsAsObject,
    sheets: sheetsAsObject,
    sectionsAsArray: sections,
    objects
  };
};

export const getBookDigital = async bookId => {
  const {
    book,
    sectionsAsObject,
    sheets,
    sections
  } = await bookService.getBook(bookId);

  const bookDigital = new BookDigitalDetail({
    ...book,
    themeId: book.digitalData.themeId
  });

  const sheetsDigital = sheets.map(
    s =>
      new SheetDigitalDetail({
        ...s,
        ...s.digitalData
      })
  );
  const sheetsAsObject = {};
  sheetsDigital.forEach(sheet => (sheetsAsObject[sheet.id] = sheet));

  return {
    book: bookDigital,
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

    window.data.book.sections.forEach(section => {
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
  }
};

export const setIsPhotoVisited = isPhotoVisited => {
  setTimeout(() => {
    window.data.book.isPhotoVisited = isPhotoVisited;
  });
};

export default {
  ...bookService,
  getBookManager,
  setIsPhotoVisited
};
