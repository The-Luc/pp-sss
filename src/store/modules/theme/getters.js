import THEME from './const';

export const getters = {
  [THEME._GETTERS.GET_THEMES]: ({ themes }) => {
    return themes;
  },
  [THEME._GETTERS.GET_LAYOUTS]: ({ layouts }) => themeId => {
    return layouts.filter(l => l.themeId === themeId);
  }
};
