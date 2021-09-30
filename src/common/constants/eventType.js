export const EVENT_TYPE = {
  PRINT_ADD_ELEMENT: 'printAddElement',
  DIGITAL_ADD_ELEMENT: 'digitalAddElement',
  CHANGE_TEXT_PROPERTIES: 'changeTextProperties',
  ADD_SHAPES: 'addShapes',
  CHANGE_SHAPE_PROPERTIES: 'changeShapeProperties',
  ADD_CLIPARTS: 'addClipArts',
  CHANGE_CLIPART_PROPERTIES: 'changeClipArtProperties',
  CHANGE_IMAGE_PROPERTIES: 'changeImageProperties',
  CHANGE_PORTRAIT_IMAGE_PROPERTIES: 'changePortraitImageProperties',
  CHANGE_VIDEO_PROPERTIES: 'changeVideoProperties',
  CHANGE_OBJECT_IDS_ORDER: 'changeObjectIdsOrder',
  PREVIEW_ANIMATION: 'previewAnimation',
  DIGITAL_BACKGROUND_ADD: 'digitalAddBackground',
  BACKGROUND_PROP_CHANGE: 'changeBackgroundProperties',
  DIGITAL_BACKGROUND_REMOVE: 'digitalDeleteBackground',
  SAVE_STYLE: 'saveStyle',
  COPY_OBJ: 'copyObj',
  PASTE_OBJ: 'pasteObj',
  SAVE_LAYOUT: 'saveLayout',
  DELETE_OBJECTS: 'deleteObjects',
  REMOVE_IMAGE: 'removeImage',
  CENTERCROP: 'centercrop',
  VIDEO_TOGGLE_PLAY: 'videoTogglePlay',
  VIDEO_REWIND: 'videoRewind',
  VIDEO_KEEP_REWIND: 'videoKeepRewind',
  VIDEO_STOP_KEEP_REWIND: 'videoStopKeepRewind',
  VIDEO_FORWARD: 'videoForward',
  VIDEO_KEEP_FORWARD: 'videoKeepForward',
  VIDEO_STOP_KEEP_FORWARD: 'videoStopKeepForward',
  TRANSITION_PREVIEW: 'transitionPreview',
  APPLY_ANIMATION: 'applyAnimation',
  CHANGE_ANIMATION_ORDER: 'changeAnimationOrder',
  BACKGROUND_SELECT: 'backgroundToggleSelection',
  ANIMATION_SELECT: 'selectAnimationObject'
};

export const CANVAS_EVENT_TYPE = {
  SELECTION_CREATED: 'selection:created',
  SELECTION_UPDATED: 'selection:updated',
  SELECTION_CLEARED: 'selection:cleared',
  OBJECT_ADDED: 'object:added',
  OBJECT_MODIFIED: 'object:modified',
  OBJECT_REMOVED: 'object:removed',
  OBJECT_SCALED: 'object:scaled',
  OBJECT_MOVED: 'object:moved',
  TEXT_CHANGED: 'text:changed',
  MOUSE_DOWN: 'mouse:down',
  MOUSE_UP: 'mouse:up',
  DROP: 'drop'
};

export const WINDOW_EVENT_TYPE = {
  KEY_UP: 'keyup',
  KEY_DOWN: 'keydown',
  COPY: 'copy',
  PASTE: 'paste'
};

export const VIDEO_EVENT_TYPE = {
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  SEEK: 'seek',
  REWIND: 'fastRewind',
  END_REWIND: 'endRewind',
  TOGGLE_STATUS: 'toggleStatus'
};
