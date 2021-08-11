import { BaseObject } from '@/common/models';
import { prefixObjectValue } from '@/common/utils';

export const MODULE_NAME = 'digital';

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
  TRIGGER_APPLY_LAYOUT = 'triggerApplyLayout';
  GET_OBJECTS = 'getObjectsBySheetId';
  SHEET_LAYOUT = 'sheetLayout';
  GET_SHEETS = 'getSheets';
  GET_DATA_EDIT_SCREEN = 'getDataEditScreen';
  BACKGROUNDS_NO_LAYOUT = 'getUserSelectedBackground';
  BACKGROUNDS_PROPERTIES = 'getPropertiesOfAllBackgrounds';
  SECTIONS_SHEETS = 'getSectionsAndSheets';
  DEFAULT_THEME_ID = 'getDefaultThemeId';
  GET_FRAMES_WIDTH_IDS = 'getFramesWithIds';
  CURRENT_FRAME_ID = 'currentFrameId';
  CURRENT_FRAME = 'getCurrentFrame';
  TOTAL_OBJECT = 'getTotalObject';
  CURRENT_SECTION = 'getCurrentSection';
  GET_FIRST_FRAME_THUMBNAIL = 'getFirstFrameThumbnail';

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
  UPDATE_OBJECTS_TO_STORE = 'updateObjectsToStore';

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
  SET_BACKGROUND = 'setBackground';
  SET_CURRENT_OBJECT_ID = 'setCurrentObjectId';
  ADD_OBJECT = 'addObject';
  SET_PROP = 'setObjectProperty';
  SET_PROP_BY_ID = 'setObjectPropertyById';
  SET_PROP_OF_MULIPLE_OBJECTS = 'setPropOfMultipleObjects';
  DELETE_OBJECTS = 'deleteObjects';
  UPDATE_TRIGGER_BACKGROUND_CHANGE = 'updateTriggerBackgroundChange';
  UPDATE_TRIGGER_APPLY_LAYOUT = 'updateTriggerApplyLayout';
  UPDATE_SHEET_VISITED = 'updateSheetVisited';
  UPDATE_SHEET_THUMBNAIL = 'updateSheetThumbnail';
  UPDATE_FRAME_THUMBNAIL = 'updateFrameThumbnail';
  REORDER_OBJECT_IDS = 'reorderObjectIds';
  SET_SHEET_DATA = 'setSheetData';
  SET_SUPPLEMENTAL_LAYOUT_ID = 'setSupplementalLayoutIdOnFrame';
  REMOVE_OBJECTS = 'removeObject';
  SET_BACKGROUND_PROP = 'setBackgroundProp';
  DELETE_BACKGROUND = 'deleteBackground';
  SET_FRAMES = 'setFrames';
  DELETE_FRAME = 'deleteFrame';
  REORDER_FRAME_IDS = 'reorderFrameIds';
  SET_CURRENT_FRAME_ID = 'setCurrentFrameId';
  SET_FRAME_VISITED = 'setFrameVisited';
  ADD_SUPPLEMENTAL_FRAMES = 'addSupplementalFrames';
  REPLACE_SUPPLEMENTAL_FRAME = 'replaceSupplementalFrame';
  MOVE_FRAME = 'moveFrame';
  SET_TITLE_FRAME = 'setTitleFrame';
  UPDATE_OBJECTS_TO_FRAME = 'updateObjectsToFrame';
  SET_BACKGROUNDS = 'setBackgrounds';

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
