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
  MEDIA: 'Media',
  PORTRAIT: 'PortraitFlow',
  PRINT_NOTE: 'PageNote',
  DIGITAL_NOTE: 'ScreenNote'
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
  TOOL_NAME.REDO,
  TOOL_NAME.PHOTOS,
  TOOL_NAME.MEDIA,
  TOOL_NAME.PORTRAIT
];

export const NO_SUBMENU_TOOLS = [
  TOOL_NAME.IMAGE_BOX,
  TOOL_NAME.TEXT,
  TOOL_NAME.PHOTOS,
  TOOL_NAME.MEDIA,
  TOOL_NAME.PORTRAIT
];

const THEME_ITEM = {
  iconName: 'photo_filter',
  title: 'Themes'
};

const LAYOUT_ITEM = {
  iconName: 'import_contacts',
  title: 'Layouts'
};

const BACKGROUND_ITEM = {
  iconName: 'texture',
  title: 'Backgrounds'
};

const MEDIA_ITEM = {
  iconName: 'collections'
};

export const CREATION_TOOLS = {
  THEME_PRINT: {
    ...THEME_ITEM,
    name: TOOL_NAME.PRINT_THEMES
  },
  THEME_DIGITAL: {
    ...THEME_ITEM,
    name: TOOL_NAME.DIGITAL_THEMES
  },
  LAYOUT_PRINT: {
    ...LAYOUT_ITEM,
    name: TOOL_NAME.PRINT_LAYOUTS
  },
  LAYOUT_DIGITAL: {
    ...LAYOUT_ITEM,
    name: TOOL_NAME.DIGITAL_LAYOUTS
  },
  BACKGROUND_PRINT: {
    ...BACKGROUND_ITEM,
    name: TOOL_NAME.PRINT_BACKGROUNDS
  },
  BACKGROUND_DIGITAL: {
    ...BACKGROUND_ITEM,
    name: TOOL_NAME.DIGITAL_BACKGROUNDS
  },
  CLIP_ART: {
    iconName: 'local_florist',
    title: 'Clip Art',
    name: TOOL_NAME.CLIP_ART
  },
  SHAPE: {
    iconName: 'star',
    title: 'Shapes',
    name: TOOL_NAME.SHAPES
  },
  TEXT: {
    iconName: 'text_format',
    title: 'Text',
    name: TOOL_NAME.TEXT,
    isInstruction: true
  },
  IMAGE: {
    iconName: 'photo_size_select_large',
    title: 'Image Box',
    name: TOOL_NAME.IMAGE_BOX,
    isInstruction: true
  },
  PHOTO: {
    ...MEDIA_ITEM,
    title: 'Photos',
    name: TOOL_NAME.PHOTOS,
    isUseCustomAction: true,
    isNotHighlight: true,
    isNotDiscard: true
  },
  MEDIA: {
    iconName: 'collections',
    title: 'Media',
    name: TOOL_NAME.MEDIA,
    isUseCustomAction: true,
    isNotHighlight: true,
    isNotDiscard: true
  },
  PORTRAIT: {
    iconName: 'portrait',
    title: 'Portraits',
    name: TOOL_NAME.PORTRAIT,
    isUseCustomAction: true,
    isNotHighlight: true
  },
  GRID: {
    iconName: 'grid_on',
    title: 'Grid',
    name: 'Grid'
  },
  UNDO: {
    iconName: 'undo',
    title: 'Undo',
    name: TOOL_NAME.UNDO,
    isUseCustomAction: true,
    isNotHighlight: true,
    isNotDiscard: true
  },
  REDO: {
    iconName: 'redo',
    title: 'Redo',
    name: TOOL_NAME.REDO,
    isUseCustomAction: true,
    isNotHighlight: true,
    isNotDiscard: true
  },
  DELETE: {
    iconName: 'delete',
    title: 'Delete',
    name: TOOL_NAME.DELETE,
    isUseCustomAction: true,
    isNotHighlight: true,
    isNotDiscard: true
  },
  ACTION: {
    iconName: 'smart_button',
    title: 'Actions',
    name: TOOL_NAME.ACTIONS,
    isNotDiscard: true
  },
  NOTE_PRINT: {
    iconName: 'note_add',
    title: 'Page Notes',
    name: TOOL_NAME.PRINT_NOTE
  },
  NOTE_DIGITAL: {
    iconName: 'post_add',
    title: 'Screen Notes',
    name: TOOL_NAME.DIGITAL_NOTE
  }
};

export const PRINT_CREATION_TOOLS = [
  [
    CREATION_TOOLS.THEME_PRINT,
    CREATION_TOOLS.LAYOUT_PRINT,
    CREATION_TOOLS.BACKGROUND_PRINT,
    CREATION_TOOLS.CLIP_ART
  ],
  [
    CREATION_TOOLS.SHAPE,
    CREATION_TOOLS.TEXT,
    CREATION_TOOLS.IMAGE,
    CREATION_TOOLS.PHOTO,
    CREATION_TOOLS.PORTRAIT
  ],
  [
    CREATION_TOOLS.GRID,
    CREATION_TOOLS.UNDO,
    CREATION_TOOLS.REDO,
    CREATION_TOOLS.DELETE
  ],
  [CREATION_TOOLS.ACTION, CREATION_TOOLS.NOTE_PRINT]
];

export const DIGITAL_CREATION_TOOLS = [
  [
    CREATION_TOOLS.THEME_DIGITAL,
    CREATION_TOOLS.LAYOUT_DIGITAL,
    CREATION_TOOLS.BACKGROUND_DIGITAL,
    CREATION_TOOLS.CLIP_ART
  ],
  [
    CREATION_TOOLS.SHAPE,
    CREATION_TOOLS.TEXT,
    CREATION_TOOLS.IMAGE,
    CREATION_TOOLS.MEDIA,
    CREATION_TOOLS.PORTRAIT
  ],
  [
    CREATION_TOOLS.GRID,
    CREATION_TOOLS.UNDO,
    CREATION_TOOLS.REDO,
    CREATION_TOOLS.DELETE
  ],
  [CREATION_TOOLS.ACTION, CREATION_TOOLS.NOTE_DIGITAL]
];
