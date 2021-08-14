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

export const DEBOUNCE_MUTATION = 350;

export const UPLOAD_STATUS_DISPLAY_TIME = 1000;

export const DELAY_AFTER_CHANGE_UNDO_REDO = 20;
