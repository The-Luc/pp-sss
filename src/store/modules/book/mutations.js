export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.book.sections.length; i++) {
      if (payload.sectionId == state.book.sections[i].id) {
        state.book.sections[i].sheets = payload.sheets;

        break;
      }
    }
  },
  deleteSheet(state, payload) {
    const { idSheet, idSection } = payload;
    const sectionIndex = state.book.sections.findIndex(item => {
      return item.id === idSection;
    });
    state.book.sections[sectionIndex].sheets = state.book.sections[sectionIndex].sheets.filter(item => item.id !== idSheet);
  },
};
