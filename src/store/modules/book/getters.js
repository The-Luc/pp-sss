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
  getTotalSections: state => {
    return state.book.sections.length;
  },
  getMaxPage: state => {
    return state.book.numberMaxPages;
  }
};
