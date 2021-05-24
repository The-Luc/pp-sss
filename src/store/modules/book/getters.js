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
  [BOOK._GETTERS.SECTIONS]: state => {
    return state.book.sections;
  },
  [BOOK._GETTERS.GET_TOTAL_SECTIONS]: ({ book }) => {
    return book.sections.length;
  },
  [BOOK._GETTERS.GET_MAX_PAGE]: ({ book }) => {
    return book.numberMaxPages;
  },
  [BOOK._GETTERS.GET_PAGE_SELECTED]: ({ pageSelected }) => {
    return pageSelected;
  }
};
