import THEME from './const';
import { getThemesApi } from '@/api/theme';

export const actions = {
  async [THEME._ACTIONS.GET_PRINT_THEMES]({ commit }) {
    const themes = await getThemesApi(true, false);

    commit(THEME._MUTATES.PRINT_THEMES, { themes });
  }
};
