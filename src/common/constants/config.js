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
export const THUMBNAIL_IMAGE_QUALITY = 0.2;

export const EDITION = {
  PRINT: 'print',
  DIGITAL: 'digital'
};
