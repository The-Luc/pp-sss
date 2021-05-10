export const mutations = {
  updateSection(state, payload) {
    for (let i = 0; i < state.project.sections.length; i++) {
      if (payload.sectionId == state.project.sections[i].id) {
        state.project.sections[i].sheets = payload.sheets;

        break;
      }
    }
  },
  addSection(state) {
    state.project.sections = [
      ...state.project.sections.slice(0, state.project.sections.length - 1),
      {
        color: 'orange',
        fixed: false,
        id: '100',
        name: '',
        sheets: []
      },
      ...state.project.sections.slice(state.project.sections.length - 1),
    ];
    setTimeout(() => {
      const collapse = document.querySelector('#btn-ec-all').getAttribute('data-toggle');
      let el = document.querySelector('#section-100');
      if (collapse !== 'collapse') {
        el.click();
      }
      let input = el.querySelector('input');
      input.focus()
    }, 0)
  }
};
