export const PRINT_PAGE_SIZE = {
  WIDTH: 8.5, // single page, inches. 1 sheet have 2 pages
  DOUBLE_WIDTH: 17,
  HEIGHT: 11,
  BLEED: 0.125,
  PDF_DOUBLE_WIDTH: (8.5 + 0.125) * 2, // for render canvas, not use for PDF rendering
  PDF_WIDTH: 8.75, // must include bleed to left and right for each page
  PDF_HEIGHT: 11.25, // must include bleed to top and bottom for each page
  SAFE_MARGIN: 0.5
};

export const SOFTCOVER_SPINE_SIZES = {
  28: 0.07, // for 20-28 pages
  38: 0.1, // for 30-38 pages
  48: 0.13, // for 40-48 pages
  58: 0.17, // for 50-58 pages
  68: 0.2, // for 60-68 pages
  78: 0.23, // for 70-78 pages
  88: 0.25, // for 80-88 pages
  98: 0.28, // for 90-98 pages
  108: 0.31, // for 100-108 pages
  118: 0.33, // for 110-118 pages
  128: 0.36, // for 120-128 pages
  138: 0.39, // for 130-138 pages
  148: 0.41, // for 140-148 pages
  158: 0.44, // for 150-158 pages
  168: 0.46, // for 160-168 pages
  178: 0.49, // for 170-178 pages
  188: 0.52, // for 180-188 pages
  198: 0.54, // for 190-198 pages
  208: 0.57 // for 200-208 pages
};

export const HARDCOVER_SPINE_SIZES = {
  60: 0.316, // for 20-60 pages
  100: 0.392, // for 62-100 pages
  140: 0.5, // for 102-140 pages
  180: 0.6, // for 142-180 pages
  220: 0.7, // for 182-220 pages
  260: 0.8, // for 222-260 pages
  300: 0.9, // for 262-300 pages
  340: 1 // for 302-340 pages
};

export const HARD_COVER_BLEED_X = {
  60: 1.09, // for 20-60 pages
  100: 1.05, // for 62-100 pages
  140: 1, // for 102-140 pages
  180: 0.95, // for 142-180 pages
  220: 0.9, // for 182-220 pages
  260: 0.85, // for 222-260 pages
  300: 0.8, // for 262-300 pages
  340: 0.75 // for 302-340 pages
};

export const PRINT_SOFTCOVER_PAGE_SIZE = {
  PDF_DOUBLE_WIDTH: 17.75, // 2 cover pages + spine + bleed
  PDF_HEIGHT: 11.25,
  BLEED: PRINT_PAGE_SIZE.BLEED
};

export const PRINT_HARDCOVER_PAGE_SIZE = {
  PDF_DOUBLE_WIDTH: 20, // 2 cover pages + spine + bleed
  PDF_HEIGHT: 12.75,
  BLEED_TOP: 0.755,
  BLEED_BOTTOM: 0.749
};

export const PRINT_DPI = 120;
export const DIGITAL_DPI = 120;
export const PDF_DPI = 300;
export const DATABASE_DPI = 300;

// normal page size
export const PRINT_CANVAS_SIZE = {
  WIDTH: (PRINT_PAGE_SIZE.DOUBLE_WIDTH + PRINT_PAGE_SIZE.BLEED * 2) * PRINT_DPI,
  HEIGHT: (PRINT_PAGE_SIZE.HEIGHT + PRINT_PAGE_SIZE.BLEED * 2) * PRINT_DPI,
  SAFE_MARGIN: PRINT_PAGE_SIZE.SAFE_MARGIN * PRINT_DPI
};

export const DIGITAL_PAGE_SIZE = {
  PDF_WIDTH: 16,
  PDF_HEIGHT: 9
};

export const DIGITAL_CANVAS_SIZE = {
  WIDTH: DIGITAL_PAGE_SIZE.PDF_WIDTH * DIGITAL_DPI,
  HEIGHT: DIGITAL_PAGE_SIZE.PDF_HEIGHT * DIGITAL_DPI,
  RATIO: DIGITAL_PAGE_SIZE.PDF_WIDTH / DIGITAL_PAGE_SIZE.PDF_HEIGHT
};
