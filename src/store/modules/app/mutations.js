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
  }
};
