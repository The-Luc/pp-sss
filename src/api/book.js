import { isEmpty } from '@/common/utils';

import books from '@/mock/books';
import book, { modifyBookData } from '@/mock/book';

/**
 * Temporary code, will be removed when integrating with API
 */
export const storeBookInSessionStorage = () => {
  const bookStorage = 'book-1719';

  const book = window.sessionStorage.getItem(bookStorage);

  if (isEmpty(book)) {
    window.sessionStorage.setItem(bookStorage, JSON.stringify(books[1719]));
  }
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

export default bookService;
