import {
  PRINT_HARDCOVER_PAGE_SIZE,
  PRINT_SOFTCOVER_PAGE_SIZE,
  HARDCOVER_SPINE_SIZES,
  SOFTCOVER_SPINE_SIZES,
  PRINT_DPI,
  PRINT_PAGE_SIZE
} from '@/common/constants/canvas';

/**
 * Convert Inches to Pixels value
 *
 * @param   {Number}  inches  the value to be converted
 * @returns {Number}  px value
 */
export const inchesToPixels = inches => inches * PRINT_DPI;

/**
 * Convert Object Inches to Pixels value
 *
 * @param   {Object}  obj an object with inche values to be converted
 * @returns {Object}  an object contain px values
 */
export const objectInchesToPixels = obj => {
  const pixelObject = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'number') {
      pixelObject[key] = inchesToPixels(obj[key]);
    } else {
      pixelObject[key] = obj[key];
    }
  });
  return pixelObject;
};

/**
 * Get Print size for a Cover sheet
 *
 * @param   {Boolean}  isHardCover  true for hardcover and false for softcover
 * @param   {Number}   pageCount  number of pages of the book
 * @returns {Object}   {inches, pixels } size object, each contains
 * { pdfWidth, pdfHeight, pageWidth, pageHeight, spineWidth, bleedX, bleedY, ratio }
 */
export const getCoverPagePrintSize = (isHardCover, pageCount) => {
  const sizeObjects = isHardCover
    ? { ...HARDCOVER_SPINE_SIZES }
    : { ...SOFTCOVER_SPINE_SIZES };
  const pdfFinalPageSize = isHardCover
    ? { ...PRINT_HARDCOVER_PAGE_SIZE }
    : { ...PRINT_SOFTCOVER_PAGE_SIZE };
  let pageLimit = 0;
  Object.keys(sizeObjects).forEach((maxPage, index, arr) => {
    if (!pageLimit) {
      if (maxPage >= pageCount) {
        pageLimit = maxPage;
      }
      if (index + 1 === arr.length) {
        pageLimit = maxPage;
      }
    }
  });
  const spineWidth = sizeObjects[pageLimit];
  const inches = {
    pdfWidth: pdfFinalPageSize.PDF_DOUBLE_WIDTH,
    pdfHeight: pdfFinalPageSize.PDF_HEIGHT,
    pageWidth: PRINT_PAGE_SIZE.WIDTH,
    pageHeight: PRINT_PAGE_SIZE.HEIGHT,
    spineWidth: spineWidth,
    bleedX:
      (pdfFinalPageSize.PDF_DOUBLE_WIDTH -
        PRINT_PAGE_SIZE.WIDTH * 2 -
        spineWidth) /
      2,
    bleedY: (pdfFinalPageSize.PDF_HEIGHT - PRINT_PAGE_SIZE.HEIGHT) / 2,
    ratio: pdfFinalPageSize.PDF_DOUBLE_WIDTH / pdfFinalPageSize.PDF_HEIGHT
  };
  const pixels = {
    ...objectInchesToPixels(inches),
    ratio: inches.ratio
  };
  return {
    inches,
    pixels
  };
};

/**
 * Get Print size for a non-Cover sheet
 *
 * @returns {Object} {inches, pixels } size object,
 * each contains { pdfWidth, pdfHeight, pageWidth, pageHeight, spineWidth, bleedX, bleedY }
 */
export const getPagePrintSize = () => {
  const inches = {
    pdfWidth: PRINT_PAGE_SIZE.PDF_DOUBLE_WIDTH,
    pdfHeight: PRINT_PAGE_SIZE.PDF_HEIGHT,
    pageWidth: PRINT_PAGE_SIZE.WIDTH,
    pageHeight: PRINT_PAGE_SIZE.HEIGHT,
    spineWidth: 0,
    bleedX: PRINT_PAGE_SIZE.BLEED,
    bleedY: PRINT_PAGE_SIZE.BLEED,
    ratio: PRINT_PAGE_SIZE.PDF_DOUBLE_WIDTH / PRINT_PAGE_SIZE.PDF_HEIGHT
  };
  const pixels = {
    ...objectInchesToPixels(inches),
    ratio: inches.ratio
  };
  return {
    inches,
    pixels
  };
};
