import { BaseObject } from '@/common/models';
import { prefixObjectValue } from '@/common/utils';

export const MODULE_NAME = 'print';

class GetterClass extends BaseObject {
  CURRENT_SHEET = 'getCurrentSheet';
  TOTAL_BACKGROUND = 'getTotalBackground';
  CURRENT_OBJECT = 'getCurrentObject';
  CURRENT_OBJECT_ID = 'getCurrentObjectId';
  OBJECT_BY_ID = 'objectById';
  SELECT_PROP_CURRENT_OBJECT = 'getSpecificPropertyOfCurrentObject';
  SELECT_PROP_OBJECT_BY_ID = 'getSpecificPropertyOfObjectById';
  TRIGGER_TEXT_CHANGE = 'triggerTextChange';
  TRIGGER_BACKGROUND_CHANGE = 'triggerBackgroundChange';
  TRIGGER_CLIPART_CHANGE = 'triggerClipArtChange';
  TRIGGER_SHAPE_CHANGE = 'triggerShapeChange';
  GET_OBJECTS = 'getObjectsBySheetId';
  SHEET_LAYOUT = 'sheetLayout';
  GET_SHEETS = 'getSheets';
  BACKGROUNDS_NO_LAYOUT = 'getUserSelectedBackground';
  BACKGROUNDS_PROPERTIES = 'getPropertiesOfAllBackgrounds';
  SECTIONS_SHEETS = 'getSectionsAndSheets';
  GET_PAGE_INFO = 'getPageInfo';
  DEFAULT_THEME_ID = 'getDefaultThemeId';
  TOTAL_OBJECT = 'getTotalObject';
  GET_OBJECTS_AND_BACKGROUNDS = 'getObjectsAndBackground';
  BACKGROUNDS = 'getBackgrounds';
  CURRENT_SECTION = 'getCurrentSection';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _GETTERS = new GetterClass();

export const GETTERS = new GetterClass(
  prefixObjectValue(_GETTERS, MODULE_NAME)
);

class ActionClass extends BaseObject {
  GET_DATA_MAIN = 'getDataForMainPage';
  GET_DATA_EDIT = 'getDataForEditPage';
  GET_DATA_CANVAS = 'getDataForCanvas';
  UPDATE_SHEET_THEME_LAYOUT = 'updateSheetThemeLayout';
  UPDATE_SHEET_LINK_STATUS = 'updateSheetLinkStatus';
  SAVE_LAYOUT = 'saveLayout';
  SAVE_DEFAULT_THEME_ID = 'saveDefaultThemeId';
  SAVE_SHEET_THEME_LAYOUT = 'saveSheetThemeLayout';
  UPDATE_SHEET_VISITED = 'updateSheetVisted';
  SAVE_PAGE_INFO = 'savePageInfo';
  SAVE_SPREAD_INFO = 'saveSpreadInfo';
  SAVE_SHEET_LINK_STATUS = 'saveSheetLinkStatus';
  SAVE_SHEET_THUMBNAIL = 'saveSheetThumbnail';

  constructor(props) {
    super(props);
    this._set(props);
  }
}
const _ACTIONS = new ActionClass();

export const ACTIONS = new ActionClass(
  prefixObjectValue(_ACTIONS, MODULE_NAME)
);

class MutationClass extends BaseObject {
  SET_BOOK_ID = 'setBookId';
  SET_CURRENT_SHEET_ID = 'setCurrentSheetId';
  SET_DEFAULT_THEME_ID = 'setDefaultThemeId';
  SET_SECTIONS_SHEETS = 'setSectionsSheets';
  SET_OBJECTS = 'setObjects';
  SET_BACKGROUNDS = 'setBackgrounds';
  SET_CURRENT_OBJECT_ID = 'setCurrentObjectId';
  ADD_OBJECT = 'addObject';
  SET_PROP = 'setObjectProperty';
  SET_PROP_BY_ID = 'setObjectPropertyById';
  SET_PROP_OF_MULIPLE_OBJECTS = 'setPropOfMultipleObjects';
  DELETE_OBJECTS = 'deleteObjects';
  UPDATE_TRIGGER_TEXT_CHANGE = 'updateTriggerTextChange';
  UPDATE_TRIGGER_BACKGROUND_CHANGE = 'updateTriggerBackgroundChange';
  UPDATE_SHEET_VISITED = 'updateSheetVisited';
  UPDATE_SHEET_THUMBNAIL = 'updateSheetThumbnail';
  SET_SHEET_LINK_STATUS = 'setSheetLinkStatus';
  REORDER_OBJECT_IDS = 'reorderObjectIds';
  SET_SHEET_DATA = 'setSheetData';
  REMOVE_OBJECTS = 'removeObject';
  SET_BACKGROUND_PROP = 'setBackgroundProp';
  DELETE_BACKGROUND = 'deleteBackground';
  SET_PAGE_INFO = 'setPageInfo';
  SET_STATUS_PAGE_NUMBER = 'setStatusPageNumber';
  UPDATE_SPREAD_INFO = 'updateSpreadInfo';
  CLEAR_BACKGROUNDS = 'clearBackgrounds';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _MUTATES = new MutationClass();

export const MUTATES = new MutationClass(
  prefixObjectValue(_MUTATES, MODULE_NAME)
);

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
