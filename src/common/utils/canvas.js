import {
  PRINT_HARDCOVER_PAGE_SIZE,
  PRINT_SOFTCOVER_PAGE_SIZE,
  HARDCOVER_SPINE_SIZES,
  SOFTCOVER_SPINE_SIZES,
  PRINT_DPI,
  PRINT_PAGE_SIZE
} from '@/common/constants/canvas';
import { isEmpty } from './util';

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
      pixelObject[key] = inToPx(obj[key]);
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
    sheetWidth: pdfFinalPageSize.PDF_DOUBLE_WIDTH,
    sheetHeight: pdfFinalPageSize.PDF_HEIGHT,
    pageWidth: PRINT_PAGE_SIZE.WIDTH,
    pageHeight: PRINT_PAGE_SIZE.HEIGHT,
    spineWidth: spineWidth,
    safeMargin: PRINT_PAGE_SIZE.SAFE_MARGIN,
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
    sheetWidth: PRINT_PAGE_SIZE.PDF_DOUBLE_WIDTH,
    sheetHeight: PRINT_PAGE_SIZE.PDF_HEIGHT,
    pageWidth: PRINT_PAGE_SIZE.WIDTH,
    pageHeight: PRINT_PAGE_SIZE.HEIGHT,
    spineWidth: 0,
    safeMargin: PRINT_PAGE_SIZE.SAFE_MARGIN,
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

/**
 * Responsively convert size to a correct scale size base on current DPI
 *
 * @param   {Number}  size - the size that need to be converted
 * @returns {Number}  the scaled-size
 */
export const scaleSize = size => (size * PRINT_DPI) / 72;

/**
 * Convert pt to px
 *
 * @param   {Number}  val - the pt value that need to be converted
 * @returns {Number}  the result px
 */
export const ptToPx = val => scaleSize(val);

/**
 * Conver inch to px
 *
 * @param   {Number}  val - the inch value that need to be converted
 * @returns {Number}  the result px
 */
export const inToPx = val => val * PRINT_DPI;

/**
 * Conver px to inch
 *
 * @param   {Number}  val - the px value that need to be converted
 * @returns {Number}  the result inch
 */
export const pxToIn = val => val / PRINT_DPI;

/**
 * To select the last object added into canvas
 * @param {Any} canvas - the canvas to check
 */
export const selectLatestObject = canvas => {
  const objectCount = canvas.getObjects().length;
  if (objectCount) {
    const index = canvas.getObjects().length - 1;
    canvas.setActiveObject(canvas.item(index));
    canvas.renderAll();
  }
};

/**
 * To delete all selected objects in the provided canvas
 * @param {Any} canvas - the canvas to check
 */
export const deleteSelectedObjects = canvas => {
  const activeObj = canvas.getActiveObject();
  if (isEmpty(activeObj)) return;
  if (activeObj._objects) {
    activeObj._objects.forEach(object => canvas.remove(object));
  } else {
    canvas.remove(activeObj);
  }
  canvas.discardActiveObject().renderAll();
};
