export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.book.sections.length; i++) {
      if (payload.sectionId == state.book.sections[i].id) {
        state.book.sections[i].sheets = payload.sheets;

        break;
      }
    }
  }
};
