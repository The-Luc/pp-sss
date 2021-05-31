import APP from './const';

export const mutations = {
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
  [APP._MUTATES.TOGGLE_COLOR_PICKER](state, { isOpen, data }) {
    state.colorPicker.isOpen = isOpen;
    state.colorPicker.data.color = data?.color || '';
  },
  [APP._MUTATES.SET_OBJECT_TYPE_SELECTED](state, { type }) {
    state.selectedObjectType = type;
  },
  [APP._MUTATES.TOGGLE_MENU_PROPERTIES](state, { isOpen }) {
    state.isOpenProperties = isOpen;
  },
  [APP._MUTATES.RESET_PRINT_CONFIG](state) {
    state.isOpenProperties = false;
    state.colorPicker.isOpen = false;
    state.selectedObjectType = '';
    state.selectedToolName = '';
  },
  [APP._MUTATES.SET_TOOL_NAME_SELECTED](state, { name }) {
    state.selectedToolName = name;
  },
  [APP._MUTATES.SET_COLOR_PICKER_PRESETS](state, { preset }) {
    const { max, next } = state.colorPicker.data.presets;

    state.colorPicker.data.presets.values.splice(next, 1, preset);

    const newIndex = next >= max - 1 ? 0 : next + 1;

    state.colorPicker.data.presets.next = newIndex;
  },
  [APP._MUTATES.SET_IS_PROMPT](state, { isPrompt }) {
    state.isPrompt = isPrompt;
  },
  [APP._MUTATES.SET_COLOR_PICKER_COLOR](state, { color }) {
    state.colorPicker.data.color = color;
  }
};
