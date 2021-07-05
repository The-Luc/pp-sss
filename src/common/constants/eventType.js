export const EVENT_TYPE = {
  PRINT_ADD_ELEMENT: 'printAddElement',
  DIGITAL_ADD_ELEMENT: 'digitalAddElement',
  PRINT_INSTRUCTION_START: 'printInstructionStart',
  PRINT_INSTRUCTION_END: 'printInstructionEnd',
  DIGITAL_INSTRUCTION_START: 'digitalInstructionStart',
  DIGITAL_INSTRUCTION_END: 'digitalInstructionEnd',
  CHANGE_TEXT_PROPERTIES: 'changeTextProperties'
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
  KEY_UP: 'keyup'
};
