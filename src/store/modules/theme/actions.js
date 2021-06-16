import THEME from './const';
import { loadPrintThemes } from '@/api/theme';

export const actions = {
  async [THEME._ACTIONS.GET_PRINT_THEMES]({ commit }) {
    const themes = await loadPrintThemes();
    commit(THEME._MUTATES.PRINT_THEMES, { themes });
  }
};
