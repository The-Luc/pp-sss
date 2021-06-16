import THEME from './const';
export const mutations = {
  [THEME._MUTATES.UPDATE_PRINT_THEMES](state, payload) {
    const { printThemes } = payload;
    state.printThemes = printThemes;
  }
};
