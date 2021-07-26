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
export const THUMBNAIL_IMAGE_QUALITY = 0.1;

export const AUTOSAVE_INTERVAL = 60000; // ~ 60 seconds

export const SAVING_DURATION = 2000; // ~ 2 seconds

export const MAX_SUPPLEMENTAL_FRAMES = 10;

export const MAX_SAVED_TEXT_STYLES = 9;

export const MAX_SAVED_IMAGE_STYLES = 12;

export const MODIFICATION = {
  ADD: 0,
  UPDATE: 1,
  DELETE: 2
};
