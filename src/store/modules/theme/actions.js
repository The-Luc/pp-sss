import THEME from './const';
import { loadPrintThemes } from '@/api/theme';

export const actions = {
  [THEME._ACTIONS.GET_PRINT_THEMES]({ commit }) {
    const res = loadPrintThemes();
    commit(THEME._MUTATES.UPDATE_PRINT_THEMES, res);
  }
};
