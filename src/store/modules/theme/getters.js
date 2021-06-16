import THEME from './const';

export const getters = {
  [THEME._GETTERS.GET_PRINT_THEMES]: ({ printThemes }) => {
    return printThemes;
  },
  [THEME._GETTERS.GET_LAYOUTS]: ({ layouts }) => themeId => {
    if (themeId) {
      return layouts.filter(l => l.themeId === themeId);
    }
    return layouts;
  },
  [THEME._GETTERS.GET_LAYOUT_BY_TYPE]: state => (themeId, layoutType) => {
    return state.layouts.filter(
      layout => layout.themeId === themeId && layout.type === layoutType
    );
  }
};
