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
  GET_ARRAY_FRAMES = 'getArrayFrames';
  CURRENT_FRAME_ID = 'currentFrameId';
  CURRENT_FRAME = 'getCurrentFrame';
  TOTAL_OBJECT = 'getTotalObject';
  CURRENT_SECTION = 'getCurrentSection';
  GET_FIRST_FRAME_THUMBNAIL = 'getFirstFrameThumbnail';
  GET_SHEET_MEDIA = 'getSheetMedia';
  TRIGGER_TRANSITION = 'getTriggerTransition';
  TRIGGER_ANIMATION = 'getTriggerAnimation';
  STORE_ANIMATION_PROP = 'storeAnimationProp';
  PLAY_IN_IDS = 'playInIds';
  PLAY_OUT_IDS = 'playOutIds';
  PLAY_IN_ORDER = 'playInOrder';
  PLAY_OUT_ORDER = 'playOutOrder';
  GET_FRAME_IDS = 'getFrameIds';
  TOTAL_ANIMATION_PLAY_OUT_ORDER = 'getTotalAnimationPlayOutOrder';
  CURRENT_FRAME_INDEX = 'getCurrentFrameIndex';
  GET_PLAY_IN_DURATION = 'getPlayInDuration';
  GET_PLAY_OUT_DURATION = 'getPlayOutDuration';
  GET_TOTAL_VIDEO_DURATION = 'getTotalVideoDuration';
  IS_PHOTO_VISITED = 'isPhotoVisited';
  COMMUNITY_ID = 'getCommunityId';

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
  ADD_OBJECTS = 'addObjects';
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
  SET_FRAME_DELAY = 'setFrameDealy';
  UPDATE_OBJECTS_TO_FRAME = 'updateObjectsToFrame';
  SET_BACKGROUNDS = 'setBackgrounds';
  SET_BOOK_INFO = 'setBookInfo';
  SET_SHEET_MEDIA = 'setSheetMedia';
  DELETE_SHEET_MEDIA = 'deleteSheetMedia';
  UPDATE_TRIGGER_TRANSITION = 'updateTriggerTransition';
  UPDATE_TRIGGER_ANIMATION = 'updateTriggerAnimation';
  SET_STORE_ANIMATION_PROP = 'setStoreAnimationProp';
  SET_PLAY_IN_ORDER = 'setPlayInOrder';
  SET_PLAY_OUT_ORDER = 'setPlayOutOrder';
  SET_PLAY_IN_IDS = 'setPlayInIds';
  SET_PLAY_OUT_IDS = 'setPlayOutIds';
  UPDATE_SECTION = 'updateSection';

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
