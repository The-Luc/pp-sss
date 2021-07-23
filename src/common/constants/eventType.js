export const EVENT_TYPE = {
  PRINT_ADD_ELEMENT: 'printAddElement',
  DIGITAL_ADD_ELEMENT: 'digitalAddElement',
  PRINT_INSTRUCTION_START: 'printInstructionStart',
  PRINT_INSTRUCTION_END: 'printInstructionEnd',
  DIGITAL_INSTRUCTION_START: 'digitalInstructionStart',
  DIGITAL_INSTRUCTION_END: 'digitalInstructionEnd',
  CHANGE_TEXT_PROPERTIES: 'changeTextProperties',
  ADD_SHAPES: 'addShapes',
  CHANGE_SHAPE_PROPERTIES: 'changeShapeProperties',
  ADD_CLIPARTS: 'addClipArts',
  CHANGE_CLIPART_PROPERTIES: 'changeClipArtProperties',
  CHANGE_IMAGE_PROPERTIES: 'changeImageProperties',
  CHANGE_OBJECT_IDS_ORDER: 'changeObjectIdsOrder',
  DIGITAL_BACKGROUND_ADD: 'digitalAddBackground',
  DIGITAL_BACKGROUND_PROP_CHANGE: 'digitalChangeBackgroundProperties',
  DIGITAL_BACKGROUND_REMOVE: 'digitalDeleteBackground',
  SWITCH_TOOL: 'switchTool',
  SAVE_STYLE: 'saveStyle',
  CHANGE_IMAGE_PROPERTIES: 'changeImageProperties',
  COPY_OBJ: 'copyObj',
  PASTE_OBJ: 'pasteObj',
  SAVE_LAYOUT: 'saveLayout'
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
  MOUSE_DOWN: 'mouse:down'
};

export const WINDOW_EVENT_TYPE = {
  KEY_UP: 'keyup',
  COPY: 'copy',
  PASTE: 'paste'
};
