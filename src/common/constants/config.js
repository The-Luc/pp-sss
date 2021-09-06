const { VUE_APP_API_URL: API_URL, VUE_APP_BOOK_ID: BOOK_ID } = process.env;

export const ENV_CONFIG = {
  API_URL,
  BOOK_ID
};

export const COPY_OBJECT_KEY = 'ppObject';

export const PASTE = {
  DELAY_TIME: 1000, // MS
  DISTANCE: 0.5 // inch
};

// live thumbnail on the left sidebar
export const THUMBNAIL_IMAGE_CONFIG = {
  QUALITY: 0.5,
  MULTIPLIER: 0.5,
  FORMAT: 'jpeg'
};

export const AUTOSAVE_INTERVAL = 60000; // ~ 60 seconds

export const MAX_SUPPLEMENTAL_FRAMES = 10;

export const MAX_SAVED_TEXT_STYLES = 9;

export const MAX_SAVED_IMAGE_STYLES = 12;

export const MIN_IMAGE_SIZE = 500; //px

export const IMAGE_INDICATOR = {
  STROKE: '#42738d',
  STROKE_WIDTH: 10
};

export const CROP_CONTROL = {
  WIDTH: 600,
  HEIGHT: 300,
  OFFSET: 50
};

export const DEFAULE_SLIDER = {
  COLOR: '#D3D3D3',
  FILL_COLOR: '#42738D',
  THUMB_COLOR: '#FFFFFF'
};

export const DEBOUNCE_MUTATION = 350;

export const UPLOAD_STATUS_DISPLAY_TIME = 1000;

export const MAX_STEP_UNDO_REDO = 5;

export const MOUSE_HOLD_DETECT_TIME = 500;

export const DEBOUNCE_PROPERTIES = ['color', 'opacity', 'shadow', 'volume'];
