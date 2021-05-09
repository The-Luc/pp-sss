export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.project.sections.length; i++) {
      if (payload.sectionId == state.project.sections[i].id) {
        state.project.sections[i].sheets = payload.sheets;
        
        break;
      }
    }
  },
  deleteSheet(state, payload) {
    const {idSheet, idSection} = payload;
    const sectionIndex = state.project.sections.findIndex(item => {
      return item.id === idSection;
    });
    state.project.sections[sectionIndex].sheets = state.project.sections[sectionIndex].sheets.filter(item => item.id !== idSheet);
  },
  deleteSection(state, payload) {
    const { idSection } = payload;
    state.project.sections = state.project.sections.filter(
      item => item.id !== idSection
    );
  }
};
