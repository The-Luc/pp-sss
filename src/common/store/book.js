export const setBookId = (state, { bookId }) => {
  state.book.id = bookId;
};

export const setBook = (state, { book }) => {
  state.book = book;
};

export const setSections = (state, { sections, sectionIds }) => {
  state.sections = sections;
  state.sectionIds = sectionIds;
};

export const setSheets = (state, { sheets }) => {
  state.sheets = sheets;
};
