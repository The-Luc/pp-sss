export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.project.sections.length; i++) {
      if (payload.sectionId == state.project.sections[i].id) {
        state.project.sections[i].sheets = payload.sheets;

        break;
      }
    }
  },
  addSheet(state, payload) {
    // const { idSection } = payload;
    console.log(payload);
  }
};
