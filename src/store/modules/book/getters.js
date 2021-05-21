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
  [BOOK._GETTERS.SELECTED_OBJECT_TYPE]: ({ selectedObjectType }) =>
    selectedObjectType,
  [BOOK._GETTERS.IS_OPEN_MENU_PROPERTIES]: ({ isOpenProperties }) =>
    isOpenProperties,
  [BOOK._GETTERS.SECTIONS]: state => {
    return state.book.sections;
  },
  getTotalSections: state => {
    return state.book.sections.length;
  },
  getMaxPage: state => {
    return state.book.numberMaxPages;
  },
  getPageSelected: state => {
    return state.pageSelected;
  },
  [BOOK._GETTERS.GET_BOOK_DATES]: state => {
    const { createdDate, saleDate, releaseDate, deliveryDate } = state.book;

    return {
      createdDate: createdDate,
      saleDate: saleDate,
      releaseDate: releaseDate,
      deliveryDate: deliveryDate
    };
  }
};
