import { OBJECT_TYPE } from './objectType';

export const TOOL_NAME = {
  PRINT_THEMES: 'PrintThemes',
  DIGITAL_THEMES: 'DigitalThemes',
  PRINT_LAYOUTS: 'printLayouts',
  DIGITAL_LAYOUTS: 'digitalLayouts',
  DELETE: 'Delete',
  CLIP_ART: 'ClipArt',
  IMAGE_BOX: 'ImageBox',
  TEXT: 'Text',
  PRINT_BACKGROUNDS: 'PrintBackgrounds',
  DIGITAL_BACKGROUNDS: 'DigitalBackgrounds',
  SHAPES: 'Shapes',
  ACTIONS: 'Actions',
  PHOTOS: 'Photos',
  UNDO: 'Undo',
  REDO: 'Redo',
  MEDIA: 'Media'
};

export const ACTIONS = {
  COPY: 'copy',
  PASTE: 'past',
  SAVE_LAYOUT: 'saveLayout',
  SAVE_STYLE: 'saveStyle',
  GENERATE_PDF: 'generatePdf'
};

export const PROPERTIES_TOOLS = {
  BACKGROUND: {
    id: 'background',
    name: 'Background',
    iconName: 'aspect_ratio',
    type: OBJECT_TYPE.BACKGROUND
  },
  PROPERTIES: {
    id: 'properties',
    name: 'Properties',
    iconName: 'wysiwyg'
  },
  PAGE_INFO: {
    id: 'pageInfo',
    name: 'Page Info',
    iconName: 'list_alt',
    type: 'pageInfo'
  },
  FRAME_INFO: {
    id: 'frameInfo',
    name: 'Frame Info',
    iconName: 'list_alt',
    type: 'frameInfo'
  }
};

export const PRINT_RIGHT_TOOLS = [
  PROPERTIES_TOOLS.PAGE_INFO,
  PROPERTIES_TOOLS.BACKGROUND,
  PROPERTIES_TOOLS.PROPERTIES
];

export const DIGITAL_RIGHT_TOOLS = [
  PROPERTIES_TOOLS.FRAME_INFO,
  PROPERTIES_TOOLS.BACKGROUND,
  PROPERTIES_TOOLS.PROPERTIES
];

export const INSTRUCTION_TOOLS = [TOOL_NAME.TEXT, TOOL_NAME.IMAGE_BOX];

export const NON_ELEMENT_PROPERTIES_TOOLS = [
  PROPERTIES_TOOLS.BACKGROUND,
  PROPERTIES_TOOLS.PAGE_INFO,
  PROPERTIES_TOOLS.FRAME_INFO
];

export const ONE_CLICK_TOOLS = [
  TOOL_NAME.DELETE,
  TOOL_NAME.UNDO,
  TOOL_NAME.REDO
];
