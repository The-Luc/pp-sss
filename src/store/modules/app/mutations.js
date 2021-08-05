import APP from './const';

import { isEmpty } from '@/common/utils';

export const mutations = {
  [APP._MUTATES.SET_ACTIVE_EDITION](state, { edition }) {
    state.activeEdition = edition;
  },
  [APP._MUTATES.TOGGLE_MODAL](state, payload) {
    const { isOpenModal, modalData } = payload;
    state.modal.isOpen = isOpenModal;
    state.modal.data.props = modalData?.props || {};
    state.modal.data.type = modalData?.type || '';
  },
  [APP._MUTATES.SET_SELECTION_SELECTED](state, payload) {
    const { sectionSelected } = payload;
    state.sectionSelected = sectionSelected;
  },
  [APP._MUTATES.SET_OBJECT_TYPE_SELECTED](state, { type }) {
    state.propertiesModal.selectedObjectType = type;
  },
  [APP._MUTATES.TOGGLE_MENU_PROPERTIES](state, { isOpen, objectId }) {
    state.propertiesModal.isOpen = isOpen;

    state.propertiesModal.selectedObjectId = isEmpty(objectId) ? '' : objectId;
  },
  [APP._MUTATES.RESET_PRINT_CONFIG](state) {
    state.propertiesModal.isOpen = false;
    state.colorPicker.isOpen = false;
    state.propertiesModal.selectedObjectType = '';
    state.propertiesModal.selectedObjectId = '';
    state.selectedToolName = '';
  },
  [APP._MUTATES.SET_TOOL_NAME_SELECTED](state, { name }) {
    state.selectedToolName = name;
  },
  [APP._MUTATES.SET_COLOR_PICKER_PRESETS](state, { preset }) {
    const { max, next } = state.colorPicker.presets;

    state.colorPicker.presets.values.splice(next, 1, preset);

    const newIndex = next >= max - 1 ? 0 : next + 1;

    state.colorPicker.presets.next = newIndex;
  },
  [APP._MUTATES.SET_IS_PROMPT](state, { isPrompt }) {
    state.isPrompt = isPrompt;
  },
  [APP._MUTATES.TOGGLE_ACTIVE_OBJECTS](state, data) {
    state.hasActiveObjects = data;
  },
  [APP._MUTATES.SET_PROPERTIES_OBJECT_TYPE](state, { type }) {
    state.propertiesModal.propertiesObjectType = type;
  },
  [APP._MUTATES.SET_INFO_BAR](state, info) {
    state.infoBar = {
      ...state.infoBar,
      ...info
    };
  },
  [APP._MUTATES.SET_CURRENT_OBJECT](state, currentObject) {
    state.currentObject = currentObject;
  },
  [APP._MUTATES.UPDATE_TRIGGER_TEXT_CHANGE](state) {
    state.triggerChange.text = !state.triggerChange.text;
  },
  [APP._MUTATES.SET_USER](state, { id, role }) {
    state.user = { id, role };
  },
  [APP._MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE](state) {
    state.triggerChange.clipArt = !state.triggerChange.clipArt;
  },
  [APP._MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE](state) {
    state.triggerChange.shape = !state.triggerChange.shape;
  },
  [APP._MUTATES.SET_GENERAL_INFO](
    state,
    { bookId, title, totalSheet, totalPage, totalScreen }
  ) {
    state.generalInfo = { bookId, title, totalSheet, totalPage, totalScreen };
  },
  [APP._MUTATES.SET_SAVED_TEXT_STYLES](state, { savedTextStyles }) {
    state.savedTextStyles = savedTextStyles;
  },
  [APP._MUTATES.SET_SAVED_IMAGE_STYLES](state, { savedImageStyles }) {
    state.savedImageStyles = savedImageStyles;
  },
  [APP._MUTATES.UPDATE_SAVING_STATUS](state, { status }) {
    state.savingStatus = status;
  },
  [APP._MUTATES.TOGGLE_PHOTO_SIDEBAR](state) {
    state.isOpenPhotoSidebar = !state.isOpenPhotoSidebar;
  },
  [APP._MUTATES.SET_PHOTO_VISITED](state, { isPhotoVisited }) {
    console.log(isPhotoVisited);
    state.isPhotoVisited = isPhotoVisited;
  }
};
