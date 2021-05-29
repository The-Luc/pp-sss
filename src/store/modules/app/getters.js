import APP from './const';

export const getters = {
  [APP._GETTERS.IS_OPEN_MODAL]: ({ modal: { isOpen } }) => isOpen,
  [APP._GETTERS.MODAL_DATA]: ({ modal: { data } }) => data,
  [APP._GETTERS.SECTION_SELECTED]: ({ sectionSelected }) => sectionSelected,
  [APP._GETTERS.IS_OPEN_COLOR_PICKER]: ({ colorPicker }) => colorPicker.isOpen,
  [APP._GETTERS.SELECTED_OBJECT_TYPE]: ({ selectedObjectType }) =>
    selectedObjectType,
  [APP._GETTERS.IS_OPEN_MENU_PROPERTIES]: ({ isOpenProperties }) =>
    isOpenProperties,
  [APP._GETTERS.SELECTED_TOOL_NAME]: ({ selectedToolName }) => selectedToolName,
  [APP._GETTERS.COLOR_PICKER_COLOR]: ({ colorPicker: { data } }) => data.color,
  [APP._GETTERS.COLOR_PICKER_PRESETS]: ({ colorPicker: { data } }) =>
    data.presets.values
};
