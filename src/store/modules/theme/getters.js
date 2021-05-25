import THEME from './const';

export const getters = {
  [THEME._GETTERS.GET_THEMES]: ({ themes }) => {
    return themes;
  }
};
