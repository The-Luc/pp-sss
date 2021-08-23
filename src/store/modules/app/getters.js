import { EDITION } from '@/common/constants';
import { isEmpty } from '@/common/utils';
import APP from './const';

export const getters = {
  [APP._GETTERS.ACTIVE_EDITION]: ({ activeEdition }) => activeEdition,
  [APP._GETTERS.IS_PRINT_ACTIVE]: ({ activeEdition }) =>
    activeEdition === EDITION.PRINT,
  [APP._GETTERS.IS_DIGITAL_ACTIVE]: ({ activeEdition }) =>
    activeEdition === EDITION.DIGITAL,
  [APP._GETTERS.IS_OPEN_MODAL]: ({ modal: { isOpen } }) => isOpen,
  [APP._GETTERS.MODAL_DATA]: ({ modal: { data } }) => data,
  [APP._GETTERS.SECTION_SELECTED]: ({ sectionSelected }) => sectionSelected,
  [APP._GETTERS.SELECTED_OBJECT_TYPE]: ({ propertiesModal }) =>
    propertiesModal.selectedObjectType,
  [APP._GETTERS.IS_OPEN_MENU_PROPERTIES]: ({ propertiesModal }) =>
    propertiesModal.isOpen,
  [APP._GETTERS.SELECTED_TOOL_NAME]: ({ selectedToolName }) => selectedToolName,
  [APP._GETTERS.COLOR_PICKER_PRESETS]: ({ colorPicker: { presets } }) =>
    presets.values,
  [APP._GETTERS.IS_PROMPT]: ({ isPrompt }) => isPrompt,
  [APP._GETTERS.HAS_ACTIVE_OBJECTS]: ({ hasActiveObjects }) => hasActiveObjects,
  [APP._GETTERS.PROPERTIES_OBJECT_TYPE]: ({ propertiesModal }) =>
    propertiesModal.propertiesObjectType,
  [APP._GETTERS.TAB_SELECTED_OBJECT_ID]: ({ propertiesModal }) =>
    propertiesModal.selectedObjectId,
  [APP._GETTERS.INFO_BAR]: ({ infoBar }) => infoBar,
  [APP._GETTERS.ZOOM]: ({ infoBar }) => infoBar.zoom,
  [APP._GETTERS.CURRENT_OBJECT]: ({ currentObject }) => currentObject,
  [APP._GETTERS.SELECT_PROP_CURRENT_OBJECT]: ({ currentObject }) => prop => {
    const propValue = currentObject?.[prop];

    return isEmpty(propValue) ? null : propValue;
  },
  [APP._GETTERS.USER]: ({ user }) => user,
  [APP._GETTERS.SAVING_STATUS]: ({ savingStatus }) => savingStatus,
  [APP._GETTERS.GENERAL_INFO]: ({ generalInfo }) => generalInfo,
  [APP._GETTERS.SAVED_TEXT_STYLES]: ({ savedTextStyles }) => savedTextStyles,
  [APP._GETTERS.SAVED_IMAGE_STYLES]: ({ savedImageStyles }) => savedImageStyles,
  [APP._GETTERS.IS_PHOTO_VISITED]: ({ generalInfo }) =>
    generalInfo.isPhotoVisited,
  [APP._GETTERS.IS_MEDIA_SIDEBAR_OPEN]: ({ isMediaSidebarOpen }) =>
    isMediaSidebarOpen
};
