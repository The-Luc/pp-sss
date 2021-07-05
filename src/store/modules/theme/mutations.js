import THEME from './const';
export const mutations = {
  [THEME._MUTATES.PRINT_THEMES](state, { themes }) {
    state.printThemes = [...themes];
  },
  [THEME._MUTATES.PRINT_LAYOUTS](state, { layouts }) {
    state.printLayouts = [...layouts];
  },
  [THEME._MUTATES.DIGITAL_THEMES](state, { themes }) {
    state.digitalThemes = [...themes];
  },
  [THEME._MUTATES.DIGITAL_LAYOUTS](state, { layouts }) {
    state.digitalLayouts = [...layouts];
  }
};
