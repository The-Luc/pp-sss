export const MODULE_NAME = 'digital';

const _GETTERS = {
  CURRENT_SHEET: 'getCurrentSheet',
  TOTAL_BACKGROUND: 'getTotalBackground',
  CURRENT_OBJECT: 'getCurrentObject',
  CURRENT_OBJECT_ID: 'getCurrentObjectId',
  OBJECT_BY_ID: 'objectById',
  SELECT_PROP_CURRENT_OBJECT: 'getSpecificPropertyOfCurrentObject',
  SELECT_PROP_OBJECT_BY_ID: 'getSpecificPropertyOfObjectById',
  TRIGGER_TEXT_CHANGE: 'triggerTextChange',
  TRIGGER_BACKGROUND_CHANGE: 'triggerBackgroundChange',
  TRIGGER_CLIPART_CHANGE: 'triggerClipArtChange',
  TRIGGER_SHAPE_CHANGE: 'triggerShapeChange',
  TRIGGER_APPLY_LAYOUT: 'triggerApplyLayout',
  GET_OBJECTS: 'getObjectsBySheetId',
  SHEET_LAYOUT: 'sheetLayout',
  GET_SHEETS: 'getSheets',
  BACKGROUNDS_NO_LAYOUT: 'getUserSelectedBackground',
  BACKGROUNDS_PROPERTIES: 'getPropertiesOfAllBackgrounds',
  SECTIONS_SHEETS: 'getSectionsAndSheets',
  DEFAULT_THEME_ID: 'getDefaultThemeId',
  GET_FRAMES_WIDTH_IDS: 'getFramesWithIds',
  CURRENT_FRAME_ID: 'currentFrameId',
  NEXT_FRAME_ID_AFTER_DELETE: 'nextFrameIdAfterDelete',
  CURRENT_FRAME: 'getCurrentFrame'
};

export const GETTERS = {
  CURRENT_SHEET: `${MODULE_NAME}/${_GETTERS.CURRENT_SHEET}`,
  TOTAL_BACKGROUND: `${MODULE_NAME}/${_GETTERS.TOTAL_BACKGROUND}`,
  CURRENT_OBJECT: `${MODULE_NAME}/${_GETTERS.CURRENT_OBJECT}`,
  CURRENT_OBJECT_ID: `${MODULE_NAME}/${_GETTERS.CURRENT_OBJECT_ID}`,
  OBJECT_BY_ID: `${MODULE_NAME}/${_GETTERS.OBJECT_BY_ID}`,
  SELECT_PROP_CURRENT_OBJECT: `${MODULE_NAME}/${_GETTERS.SELECT_PROP_CURRENT_OBJECT}`,
  SELECT_PROP_OBJECT_BY_ID: `${MODULE_NAME}/${_GETTERS.SELECT_PROP_OBJECT_BY_ID}`,
  TRIGGER_TEXT_CHANGE: `${MODULE_NAME}/${_GETTERS.TRIGGER_TEXT_CHANGE}`,
  TRIGGER_BACKGROUND_CHANGE: `${MODULE_NAME}/${_GETTERS.TRIGGER_BACKGROUND_CHANGE}`,
  TRIGGER_CLIPART_CHANGE: `${MODULE_NAME}/${_GETTERS.TRIGGER_CLIPART_CHANGE}`,
  TRIGGER_SHAPE_CHANGE: `${MODULE_NAME}/${_GETTERS.TRIGGER_SHAPE_CHANGE}`,
  TRIGGER_APPLY_LAYOUT: `${MODULE_NAME}/${_GETTERS.TRIGGER_APPLY_LAYOUT}`,
  GET_OBJECTS: `${MODULE_NAME}/${_GETTERS.GET_OBJECTS}`,
  SHEET_LAYOUT: `${MODULE_NAME}/${_GETTERS.SHEET_LAYOUT}`,
  GET_SHEETS: `${MODULE_NAME}/${_GETTERS.GET_SHEETS}`,
  BACKGROUNDS_NO_LAYOUT: `${MODULE_NAME}/${_GETTERS.BACKGROUNDS_NO_LAYOUT}`,
  BACKGROUNDS_PROPERTIES: `${MODULE_NAME}/${_GETTERS.BACKGROUNDS_PROPERTIES}`,
  SECTIONS_SHEETS: `${MODULE_NAME}/${_GETTERS.SECTIONS_SHEETS}`,
  DEFAULT_THEME_ID: `${MODULE_NAME}/${_GETTERS.DEFAULT_THEME_ID}`,
  GET_FRAMES_WIDTH_IDS: `${MODULE_NAME}/${_GETTERS.GET_FRAMES_WIDTH_IDS}`,
  CURRENT_FRAME_ID: `${MODULE_NAME}/${_GETTERS.CURRENT_FRAME_ID}`,
  NEXT_FRAME_ID_AFTER_DELETE: `${MODULE_NAME}/${_GETTERS.NEXT_FRAME_ID_AFTER_DELETE}`,
  CURRENT_FRAME: `${MODULE_NAME}/${_GETTERS.CURRENT_FRAME}`
};

const _ACTIONS = {
  GET_DATA_MAIN: 'getDataForMainPage',
  GET_DATA_EDIT: 'getDataForEditPage',
  GET_DATA_CANVAS: 'getDataForCanvas',
  UPDATE_SHEET_THEME_LAYOUT: 'updateSheetThemeLayout',
  UPDATE_LAYOUT_OBJ_TO_STORE: 'updateLayoutObjectToStore'
};

export const ACTIONS = {
  GET_DATA_MAIN: `${MODULE_NAME}/${_ACTIONS.GET_DATA_MAIN}`,
  GET_DATA_EDIT: `${MODULE_NAME}/${_ACTIONS.GET_DATA_EDIT}`,
  GET_DATA_CANVAS: `${MODULE_NAME}/${_ACTIONS.GET_DATA_CANVAS}`,
  UPDATE_SHEET_THEME_LAYOUT: `${MODULE_NAME}/${_ACTIONS.UPDATE_SHEET_THEME_LAYOUT}`,
  UPDATE_LAYOUT_OBJ_TO_STORE: `${MODULE_NAME}/${_ACTIONS.UPDATE_LAYOUT_OBJ_TO_STORE}`
};

const _MUTATES = {
  SET_BOOK_ID: 'setBookId',
  SET_CURRENT_SHEET_ID: 'setCurrentSheetId',
  SET_DEFAULT_THEME_ID: 'setDefaultThemeId',
  SET_SECTIONS_SHEETS: 'setSectionsSheets',
  SET_OBJECTS: 'setObjects',
  SET_BACKGROUNDS: 'setBackgrounds',
  SET_CURRENT_OBJECT_ID: 'setCurrentObjectId',
  ADD_OBJECT: 'addObject',
  SET_PROP: 'setObjectProperty',
  SET_PROP_BY_ID: 'setObjectPropertyById',
  SET_PROP_OF_MULIPLE_OBJECTS: 'setPropOfMultipleObjects',
  DELETE_OBJECTS: 'deleteObjects',
  UPDATE_TRIGGER_TEXT_CHANGE: 'updateTriggerTextChange',
  UPDATE_TRIGGER_BACKGROUND_CHANGE: 'updateTriggerBackgroundChange',
  UPDATE_TRIGGER_CLIPART_CHANGE: 'updateTriggerClipArtChange',
  UPDATE_TRIGGER_SHAPE_CHANGE: 'updateTriggerShapeChange',
  UPDATE_TRIGGER_APPLY_LAYOUT: 'updateTriggerApplyLayout',
  UPDATE_SHEET_VISITED: 'updateSheetVisited',
  UPDATE_SHEET_THUMBNAIL: 'updateSheetThumbnail',
  REORDER_OBJECT_IDS: 'reorderObjectIds',
  SET_SHEET_DATA: 'setSheetData',
  REMOVE_OBJECTS: 'removeObject',
  SET_BACKGROUND_PROP: 'setBackgroundProp',
  DELETE_BACKGROUND: 'deleteBackground',
  SET_FRAMES: 'setFrames',
  DELETE_FRAME: 'deleteFrame',
  REORDER_FRAME_IDS: 'reorderFrameIds',
  SET_CURRENT_FRAME_ID: 'setCurrentFrameId',
  ADD_FRAME: 'addFrame',
  SET_FRAME_VISITED: 'setFrameVisited',
  ADD_SUPPLEMENTAL_FRAMES: 'addSupplementalFrames',
  SET_CURRENT_FRAME_ID_AFTER_DELETE: 'setCurrentFrameIdAfterDelete'
};

export const MUTATES = {
  SET_BOOK_ID: `${MODULE_NAME}/${_MUTATES.SET_BOOK_ID}`,
  SET_CURRENT_SHEET_ID: `${MODULE_NAME}/${_MUTATES.SET_CURRENT_SHEET_ID}`,
  SET_DEFAULT_THEME_ID: `${MODULE_NAME}/${_MUTATES.SET_DEFAULT_THEME_ID}`,
  SET_SECTIONS_SHEETS: `${MODULE_NAME}/${_MUTATES.SET_SECTIONS_SHEETS}`,
  SET_OBJECTS: `${MODULE_NAME}/${_MUTATES.SET_OBJECTS}`,
  REMOVE_OBJECTS: `${MODULE_NAME}/${_MUTATES.REMOVE_OBJECTS}`,
  SET_BACKGROUNDS: `${MODULE_NAME}/${_MUTATES.SET_BACKGROUNDS}`,
  SET_CURRENT_OBJECT_ID: `${MODULE_NAME}/${_MUTATES.SET_CURRENT_OBJECT_ID}`,
  ADD_OBJECT: `${MODULE_NAME}/${_MUTATES.ADD_OBJECT}`,
  SET_PROP: `${MODULE_NAME}/${_MUTATES.SET_PROP}`,
  SET_PROP_BY_ID: `${MODULE_NAME}/${_MUTATES.SET_PROP_BY_ID}`,
  SET_PROP_OF_MULIPLE_OBJECTS: `${MODULE_NAME}/${_MUTATES.SET_PROP_OF_MULIPLE_OBJECTS}`,
  DELETE_OBJECTS: `${MODULE_NAME}/${_MUTATES.DELETE_OBJECTS}`,
  UPDATE_TRIGGER_TEXT_CHANGE: `${MODULE_NAME}/${_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE}`,
  UPDATE_TRIGGER_BACKGROUND_CHANGE: `${MODULE_NAME}/${_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE}`,
  UPDATE_TRIGGER_CLIPART_CHANGE: `${MODULE_NAME}/${_MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE}`,
  UPDATE_TRIGGER_SHAPE_CHANGE: `${MODULE_NAME}/${_MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE}`,
  UPDATE_TRIGGER_APPLY_LAYOUT: `${MODULE_NAME}/${_MUTATES.UPDATE_TRIGGER_APPLY_LAYOUT}`,
  UPDATE_SHEET_VISITED: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_VISITED}`,
  UPDATE_SHEET_THUMBNAIL: `${MODULE_NAME}/${_MUTATES.UPDATE_SHEET_THUMBNAIL}`,
  REORDER_OBJECT_IDS: `${MODULE_NAME}/${_MUTATES.REORDER_OBJECT_IDS}`,
  SET_SHEET_DATA: `${MODULE_NAME}/${_MUTATES.SET_SHEET_DATA}`,
  SET_BACKGROUND_PROP: `${MODULE_NAME}/${_MUTATES.SET_BACKGROUND_PROP}`,
  DELETE_BACKGROUND: `${MODULE_NAME}/${_MUTATES.DELETE_BACKGROUND}`,
  SET_FRAMES: `${MODULE_NAME}/${_MUTATES.SET_FRAMES}`,
  DELETE_FRAME: `${MODULE_NAME}/${_MUTATES.DELETE_FRAME}`,
  REORDER_FRAME_IDS: `${MODULE_NAME}/${_MUTATES.REORDER_FRAME_IDS}`,
  SET_CURRENT_FRAME_ID: `${MODULE_NAME}/${_MUTATES.SET_CURRENT_FRAME_ID}`,
  ADD_FRAME: `${MODULE_NAME}/${_MUTATES.ADD_FRAME}`,
  SET_CURRENT_FRAME_VISITED: `${MODULE_NAME}/${_MUTATES.SET_CURRENT_FRAME_VISITED}`,
  ADD_SUPPLEMENTAL_FRAMES: `${MODULE_NAME}/${_MUTATES.ADD_SUPPLEMENTAL_FRAMES}`
};

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
