import { BookDetail, Section, Sheet } from '@/common/models';

import { isEmpty } from '@/common/utils';

import books from '@/mock/books';
import book, { modifyBookData } from '@/mock/book';

/**
 * Temporary code, will be removed when integrating with API
 */
export const storeBookInSessionStorage = () => {
  const bookStorage = 'book-1719';
  const sectionStorage = 'section-1719';
  const sheetStorage = 'sheet-1719';

  const book = window.sessionStorage.getItem(bookStorage);

  if (!isEmpty(book)) return;

  window.sessionStorage.setItem(bookStorage, JSON.stringify(books[1719]));

  // tempory code, will remove when Luc finish his task
  const sections = [];
  const sheets = {};

  books[1719].sections.forEach(section => {
    const sheetIds = [];

    section.sheets.forEach(sheet => {
      const { id } = sheet;

      sheets[id] = { ...sheet };

      sheetIds.push(id);
    });

    section.sheetIds = sheetIds;

    delete section.sheets;

    sections.push(section);
  });

  window.sessionStorage.setItem(sectionStorage, JSON.stringify(sections));
  window.sessionStorage.setItem(sheetStorage, JSON.stringify(sheets));
  // end temporary code
};

/**
 * Temporary code, will be replaced when integrating with API
 */
export const getBookManagerApi = bookId => {
  return new Promise(resolve => {
    const bookData = JSON.parse(
      window.sessionStorage.getItem(`book-${bookId}`)
    );
    const sectionData = JSON.parse(
      window.sessionStorage.getItem(`section-${bookId}`)
    );
    const sheetData = JSON.parse(
      window.sessionStorage.getItem(`sheet-${bookId}`)
    );
    const coverType = window.sessionStorage.getItem('bookCoverType');
    const maxPage = window.sessionStorage.getItem('bookMaxPage');

    delete bookData.printData;
    delete bookData.digitalData;

    if (!isEmpty(coverType)) bookData.coverOption = coverType;

    if (!isEmpty(maxPage)) bookData.numberMaxPages = parseInt(maxPage, 10);

    const sectionIds = [];
    const sections = {};
    const sheets = {};

    // tempory code, will change when Luc finish his task
    sectionData.forEach(section => {
      const { id } = section;

      sections[id] = new Section(section);

      sectionIds.push(id);
    });

    Object.values(sheetData).forEach(sheet => {
      delete sheet.printData;
      delete sheet.digitalData;

      sheets[sheet.id] = new Sheet(sheet);
    });

    const book = new BookDetail(bookData);

    if (isEmpty(window.data)) window.data = {};

    window.data.book = book;
    window.data.sectionIds = sectionIds;
    window.data.sections = sections;
    window.data.sheets = sheets;
    // end temporary code

    resolve({
      book: new BookDetail(bookData),
      sectionIds,
      sections,
      sheets
    });
  });
};

const bookService = {
  getBook: bookId => {
    let res = { ...book };
    // Handle for QC test
    const [coverType, maxPage] = bookId.split('-');
    if (coverType && maxPage) {
      res = modifyBookData({
        coverType,
        maxPage
      });
    }
    res.id = bookId;
    // End handle for QC test
    return res;
  },
  updateTitle: (bookId, title) => ({
    data: title,
    isSuccess: true
  }),
  updateSection: (bookId, sectionId, data) => {
    return {
      isSuccess: true,
      data: {
        bookId,
        sectionId,
        data
      }
    };
  },
  getSections: function() {
    return book.sections;
  },
  getSection: function(sectionId) {
    const index = book.sections.findIndex(s => s.id === sectionId);

    return index < 0 ? null : book.sections[index];
  },
  getSheets: function(sectionId) {
    const section = this.getSection(sectionId);

    return section === null ? [] : section.sheets;
  },
  getSheet: function(sectionId, sheetId) {
    const sheets = this.getSheets(sectionId);

    const index = sheets.findIndex(s => s.id === sheetId);

    return index < 0 ? null : sheets[index];
  },
  updateBook: () => {
    // api.put(`${ENDPOINT.GET_BOOK}/${data.albumId}`, data);
    return {
      status: 200,
      data: 'ok'
    };
  }
};

export default {
  ...bookService,
  getBookManager: getBookManagerApi
};
