import AUTH from './const';

export const actions = {
  [AUTH._ACTIONS.LOGIN]({ commit }) {
    commit(AUTH._ACTIONS.LOGIN);
  },
  [AUTH._ACTIONS.LOGOUT]({ commit }) {
    commit(AUTH._ACTIONS.LOGOUT);
  }
};
