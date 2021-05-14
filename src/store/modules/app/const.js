export const MODULE_NAME = 'app';

const _GETTERS = {
  IS_OPEN_MODAL: 'isOpenModal',
  MODAL_DATA: 'modalData',
  SECTION_SELECTED: 'sectionSelected'
};

export const GETTERS = {
  IS_OPEN_MODAL: `${MODULE_NAME}/${_GETTERS.IS_OPEN_MODAL}`,
  MODAL_DATA: `${MODULE_NAME}/${_GETTERS.MODAL_DATA}`,
  SECTION_SELECTED: `${MODULE_NAME}/${_GETTERS.SECTION_SELECTED}`
};

const _ACTIONS = {};

export const ACTIONS = {};

const _MUTATES = {
  TOGGLE_MODAL: 'toggleModal',
  SET_SELECTION_SELECTED: 'setSectionSelected'
};

export const MUTATES = {
  TOGGLE_MODAL: `${MODULE_NAME}/${_MUTATES.TOGGLE_MODAL}`,
  SET_SELECTION_SELECTED: `${MODULE_NAME}/${_MUTATES.SET_SELECTION_SELECTED}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
