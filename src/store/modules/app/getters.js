import APP from './const';

export const getters = {
  [APP._GETTERS.IS_OPEN_MODAL]: ({ modal: { isOpen } }) => isOpen,
  [APP._GETTERS.MODAL_DATA]: ({ modal: { data } }) => data,
  [APP._GETTERS.SECTION_SELECTED]: ({ sectionSelected }) => sectionSelected,
  [APP._GETTERS.IS_OPEN_COLOR_PICKER]: ({ isOpenColorPicker }) =>
    isOpenColorPicker,
  [APP._GETTERS.SELECTED_OBJECT_TYPE]: ({ selectedObjectType }) =>
    selectedObjectType,
  [APP._GETTERS.IS_OPEN_MENU_PROPERTIES]: ({ isOpenProperties }) =>
    isOpenProperties,
  [APP._GETTERS.SELECTED_TOOL_NAME]: ({ selectedToolName }) => selectedToolName,
  [APP._GETTERS.IS_PROMPT]: ({ isPrompt }) => isPrompt
};
