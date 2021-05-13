import APP from './const';

export const mutations = {
  [APP._MUTATES.UPDATE_SECTIONS](state, payload) {
    const { sections } = payload;

    state.sections = sections;
  },
  [APP._MUTATES.UPDATE_SHEETS](state, payload) {
    const { sectionId, sheets } = payload;

    const index = state.sections.findIndex(s => s.id === sectionId);

    if (index >= 0) {
      state.sections[index].sheets = sheets;
    }
  }
};
