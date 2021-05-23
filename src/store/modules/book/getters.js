import BOOK from './const';

export const getters = {
  getSections: ({ book }) => {
    return book.sections.sort((firstEl, secondEl) => {
      return firstEl.order - secondEl.order;
    });
  },
  getTotalInfo: ({ book }) => {
    return {
      totalPages: book.totalPages,
      totalSheets: book.totalSheets,
      totalScreens: book.totalScreens
    };
  },
  [BOOK._GETTERS.BOOK_DETAIL]: ({ book }) => book,
  [BOOK._GETTERS.BOOK_ID]: ({ book }) => book.id,
  [BOOK._GETTERS.SECTIONS]: state => {
    return state.book.sections;
  },
  getTotalSections: ({ book }) => {
    return book.sections.length;
  },
  getMaxPage: ({ book }) => {
    return book.numberMaxPages;
  },
  getPageSelected: ({ pageSelected }) => {
    return pageSelected;
  }
};
