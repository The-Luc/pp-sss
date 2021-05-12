export const MODULE_NAME = 'app';

const _GETTERS = {
  IS_OPEN_MODAL: 'isOpenModal',
  MODAL_DATA: 'modalData'
};

export const GETTERS = {
  IS_OPEN_MODAL: `${MODULE_NAME}/${_GETTERS.IS_OPEN_MODAL}`,
  MODAL_DATA: `${MODULE_NAME}/${_GETTERS.MODAL_DATA}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  TOGGLE_MODAL: 'toggleModal'
};

export const MUTATES = {
  TOGGLE_MODAL: `${MODULE_NAME}/${_MUTATES.TOGGLE_MODAL}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
