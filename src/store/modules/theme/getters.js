import THEME from './const';

export const getters = {
  [THEME._GETTERS.GET_PRINT_THEMES]: ({ printThemes }) => {
    return printThemes;
  },
  [THEME._GETTERS.GET_PRINT_LAYOUTS_BY_THEME_ID]: ({
    printLayouts
  }) => themeId => {
    if (themeId) {
      return printLayouts.filter(l => l.themeId === themeId);
    }
    return printLayouts;
  },
  [THEME._GETTERS.GET_PRINT_LAYOUT_BY_TYPE]: state => (themeId, layoutType) => {
    return state.printLayouts.filter(
      layout => layout.themeId === themeId && layout.type === layoutType
    );
  }
};
