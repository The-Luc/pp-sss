import APP from './const';

export const getters = {
  [APP._GETTERS.IS_OPEN_MODAL]: ({ modal: { isOpen } }) => isOpen,
  [APP._GETTERS.MODAL_DATA]: ({ modal: { data } }) => data,
  [APP._GETTERS.SECTION_SELECTED]: ({ sectionSelected }) => sectionSelected
};
