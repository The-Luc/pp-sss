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
    const { sectionId } = payload;
    let sections = state.project.sections;
    let index = sections.findIndex(item => item.id === sectionId);
    if (index !== sections.length - 1){
      sections[index].sheets = [
        ...sections[index].sheets,
        {
          id: 34,
          type: 'full',
          fixed: true
        }
      ];
    }
    else {
      sections[index].sheets = [
        ...sections[index].sheets.slice(0, sections[index].sheets.length - 1),
        {
          id: 99,
          type: 'full',
          fixed: true
        },
        ...sections[index].sheets.slice(sections[index].sheets.length - 1)
      ];
    }
    console.log(index);
  }
};
