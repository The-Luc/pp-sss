import BOOK from './const';

export const getters = {
  getSections: state => {
    return state.book.sections.sort((firstEl, secondEl) => {
      return firstEl.order - secondEl.order;
    });
  },
  getTotalInfo: state => {
    return {
      totalPages: state.book.totalPages,
      totalSheets: state.book.totalSheets,
      totalScreens: state.book.totalScreens
    };
  },
  [BOOK._GETTERS.BOOK_DETAIL]: ({ book }) => book,
  [BOOK._GETTERS.BOOK_ID]: ({ book }) => book.id,
  [BOOK._GETTERS.SECTIONS]: state => {
    return state.book.sections.sort((firstEl, secondEl) => {
      return firstEl.order - secondEl.order;
    });
  },
  getTotalSections: state => {
    return state.book.sections.length;
  }
};
