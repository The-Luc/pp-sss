import THEME from './const';

export const getters = {
  [THEME._GETTERS.GET_THEMES]: ({ themes }) => {
    return themes;
  },
  [THEME._GETTERS.GET_PRINT_LAYOUTS]: ({ printLayouts }) => themeId => {
    if (themeId) {
      return printLayouts.filter(l => l.themeId === themeId);
    }
    return printLayouts;
  },
  [THEME._GETTERS.IS_PRINT_LAYOUT_EMPTY]: ({ printLayouts }) => {
    return printLayouts.length === 0;
  },
  [THEME._GETTERS.GET_PRINT_LAYOUT_BY_TYPE]: state => (themeId, layoutType) => {
    return state.printLayouts.filter(
      layout => layout.themeId === themeId && layout.type === layoutType
    );
  }
};
