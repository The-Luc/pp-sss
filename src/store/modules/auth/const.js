export const MODULE_NAME = "auth";

const _GETTERS = {};

const _ACTIONS = {
  LOGIN: "login",
  LOGOUT: "logout"
};

export const ACTIONS = {
  LOGIN: `${MODULE_NAME}/${_ACTIONS.LOGIN}`,
  LOGOUT: `${MODULE_NAME}/${_ACTIONS.LOGOUT}`
};

const _MUTATES = {
  LOGIN: "login",
  LOGOUT: "logout"
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
