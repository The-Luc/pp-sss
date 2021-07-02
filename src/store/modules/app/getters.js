import APP from './const';

export const getters = {
  [APP._GETTERS.IS_OPEN_MODAL]: ({ modal: { isOpen } }) => isOpen,
  [APP._GETTERS.MODAL_DATA]: ({ modal: { data } }) => data,
  [APP._GETTERS.SECTION_SELECTED]: ({ sectionSelected }) => sectionSelected,
  [APP._GETTERS.IS_OPEN_COLOR_PICKER]: ({ colorPicker }) => colorPicker.isOpen,
  [APP._GETTERS.SELECTED_OBJECT_TYPE]: ({ propertiesModal }) =>
    propertiesModal.selectedObjectType,
  [APP._GETTERS.IS_OPEN_MENU_PROPERTIES]: ({ propertiesModal }) =>
    propertiesModal.isOpen,
  [APP._GETTERS.SELECTED_TOOL_NAME]: ({ selectedToolName }) => selectedToolName,
  [APP._GETTERS.COLOR_PICKER_COLOR]: ({ colorPicker: { data } }) => data.color,
  [APP._GETTERS.COLOR_PICKER_CUSTOM_PROPS]: ({ colorPicker: { data } }) => data,
  [APP._GETTERS.COLOR_PICKER_PRESETS]: ({ colorPicker: { presets } }) =>
    presets.values,
  [APP._GETTERS.IS_PROMPT]: ({ isPrompt }) => isPrompt,
  [APP._GETTERS.HAS_ACTIVE_OBJECTS]: ({ hasActiveObjects }) => hasActiveObjects,
  [APP._GETTERS.PROPERTIES_OBJECT_TYPE]: ({ propertiesModal }) =>
    propertiesModal.propertiesObjectType,
  [APP._GETTERS.TAB_SELECTED_OBJECT_ID]: ({ propertiesModal }) =>
    propertiesModal.selectedObjectId
};
