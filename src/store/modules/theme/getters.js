import THEME from './const';

export const getters = {
  [THEME._GETTERS.GET_THEMES]: ({ themes }) => {
    return themes;
  },
  [THEME._GETTERS.GET_LAYOUTS]: ({ layouts }) => themeId => {
    if (themeId) {
      return layouts.filter(l => l.themeId === themeId);
    }
    return layouts;
  },
  [THEME._GETTERS.GET_LAYOUT_BY_TYPE]: state => (themeId, layoutType) => {
    const allLayouts = state.layouts;
    const currentLayouts = allLayouts.filter(
      layout => layout.themeId === themeId && layout.type === layoutType
    );
    return currentLayouts;
  }
};
