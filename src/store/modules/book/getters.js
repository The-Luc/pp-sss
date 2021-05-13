import APP from './const';

export const getters = {
  [APP._GETTERS.SECTION_INDEX]: state => sectionId => {
    return state.sections.findIndex(s => s.id === sectionId);
  },
  [APP._GETTERS.SECTIONS]: (state) => (bookId) => {
    return state.sections;
  },
  [APP._GETTERS.SHEETS]: state => sectionId => {
    const index = state.sections.findIndex(s => s.id === sectionId);

    return index >= 0 ? state.sections[index].sheets : [];
  },
  [APP._GETTERS.SHEETS_BY_SECTION_INDEX]: state => index => {
    return index >= 0 && index < state.sections.length ? state.sections[index].sheets : [];
  }
};
