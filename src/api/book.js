import {
  BookDetail,
  SectionInfo,
  BookManagerDetail,
  BookPrintInfo,
  BookDigitalInfo,
  SheetPrintInfo,
  SheetDigitalInfo,
  SectionEditionInfo
} from '@/common/models';
import { SheetEntity } from '@/common/models/entities';

import { cloneDeep } from 'lodash';

import { parseItem } from '@/common/storage/session.helper';

import {
  isEmpty,
  getPageLeftName,
  getPageRightName,
  getPageName
} from '@/common/utils';

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
      sectionsAsObject[id] = new SectionInfo(section);
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
    sectionsAsObject
  } = await bookService.getBook(bookId);

  const bookData = new BookManagerDetail(book);

  // TODO: define sheet class for manager
  const printSheets = {};
  sheets.forEach(sheet => {
    const newSheet = new SheetPrintInfo({
      ...sheet,
      ...sheet.printData
    });

    printSheets[newSheet.id] = newSheet;
  });

  return {
    book: bookData,
    sectionIds,
    sections: sectionsAsObject,
    sheets: printSheets
  };
};

export const getBookPrint = async bookId => {
  const {
    book,
    sectionsAsObject,
    sheets,
    sections
  } = await bookService.getBook(bookId);

  const bookPrint = new BookPrintInfo({
    ...book,
    pageInfo: book.printData.pageInfo,
    themeId: book.printData.themeId
  });

  const sheetsPrint = sheets.map(
    s =>
      new SheetPrintInfo({
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

  const bookDigital = new BookDigitalInfo({
    ...book,
    themeId: book.digitalData.themeId
  });

  const sheetsDigital = sheets.map(
    s =>
      new SheetDigitalInfo({
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

export const getBookPrintInfo = async bookId => {
  // TODO: remove when integrate API
  bookId;

  let totalSheet = 0;

  const coverType = parseItem('bookCoverType');
  const maxPage = parseItem('bookMaxPage');

  const { book } = cloneDeep(window.data);

  if (!isEmpty(coverType)) book.coverOption = coverType;

  if (!isEmpty(maxPage)) book.numberMaxPages = parseInt(maxPage, 10);

  const sections = book.sections.map((section, sectionIndex) => {
    const sheets = section.sheets.map((sheet, sheetIndex) => {
      const {
        themeId,
        layoutId,
        thumbnailUrl,
        link,
        isVisited,
        media,
        spreadInfo
      } = sheet.printData;

      const pageLeftName = getPageLeftName(sheet, sheetIndex, totalSheet);
      const pageRightName = getPageRightName(sheet, sheetIndex, totalSheet);

      return new SheetPrintInfo({
        ...sheet,
        sectionId: section.id,
        themeId,
        layoutId,
        thumbnailUrl,
        link,
        isVisited,
        media,
        pageLeftName,
        pageRightName,
        spreadInfo
      });
    });

    if (sectionIndex > 0) {
      totalSheet += section.sheets.length;
    }

    return new SectionEditionInfo({
      ...section,
      sheets
    });
  });

  const { pageInfo, themeId } = book.printData;

  return Promise.resolve({
    ...new BookPrintInfo({ ...book, pageInfo, themeId }),
    sectionsSheets: sections
  });
};

export const getBookDigitalInfo = async bookId => {
  // TODO: remove when integrate API
  bookId;

  let totalSheet = 0;

  const { book } = cloneDeep(window.data);

  const sections = book.sections.map(section => {
    const sheets = section.sheets.map((sheet, sheetIndex) => {
      const {
        themeId,
        layoutId,
        thumbnailUrl,
        isVisited,
        media
      } = sheet.digitalData;

      const pageName = getPageName(sheetIndex, totalSheet);

      return new SheetDigitalInfo({
        ...sheet,
        sectionId: section.id,
        themeId,
        layoutId,
        thumbnailUrl,
        isVisited,
        media,
        pageName
      });
    });

    totalSheet += section.sheets.length;

    return new SectionEditionInfo({
      ...section,
      sheets
    });
  });

  const { pageInfo, themeId } = book.digitalData;

  return Promise.resolve({
    ...new BookDigitalInfo({ ...book, pageInfo, themeId }),
    sectionsSheets: sections
  });
};

const bookService = {
  getBook: getBookDetail,
  getBookPrint,
  getBookDigital,
  getBookPrintInfo,
  getBookDigitalInfo,
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
