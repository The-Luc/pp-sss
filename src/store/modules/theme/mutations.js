import THEME from './const';

export const mutations = {
  [THEME._MUTATES.PRINT_LAYOUTS](state, { layouts }) {
    state.printLayouts = [...layouts];
  }
};
