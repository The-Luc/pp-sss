import {
  PRINT_HARDCOVER_PAGE_SIZE,
  PRINT_SOFTCOVER_PAGE_SIZE,
  HARDCOVER_SPINE_SIZES,
  HARD_COVER_BLEED_X,
  SOFTCOVER_SPINE_SIZES,
  PRINT_DPI,
  PRINT_PAGE_SIZE
} from '@/common/constants/canvas';
import { SizeSummary } from '@/common/models';
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
 * @returns {SizeSummary}  the size summary data {inches, pixels }
 */
export const getCoverPagePrintSize = (isHardCover, pageCount) => {
  const sizeObjects = isHardCover
    ? { ...HARDCOVER_SPINE_SIZES }
    : { ...SOFTCOVER_SPINE_SIZES };
  const pdfFinalPageSize = isHardCover
    ? { ...PRINT_HARDCOVER_PAGE_SIZE }
    : { ...PRINT_SOFTCOVER_PAGE_SIZE };

  const listSizes = Object.keys(sizeObjects)
    .map(key => Number(key))
    .sort((a, b) => a - b);
  let pageLimit = listSizes[listSizes.length - 1];
  for (let index = listSizes.length - 2; index >= 0; index--) {
    const maxPage = listSizes[index];
    if (maxPage < pageCount) {
      break;
    }
    pageLimit = maxPage;
  }
  const spineWidth = sizeObjects[pageLimit];
  const inches = {
    pdfWidth: pdfFinalPageSize.PDF_DOUBLE_WIDTH,
    pdfHeight: pdfFinalPageSize.PDF_HEIGHT,
    sheetWidth: pdfFinalPageSize.PDF_DOUBLE_WIDTH,
    sheetHeight: pdfFinalPageSize.PDF_HEIGHT,
    spineWidth: spineWidth,
    safeMargin: PRINT_PAGE_SIZE.SAFE_MARGIN,
    ratio: pdfFinalPageSize.PDF_DOUBLE_WIDTH / pdfFinalPageSize.PDF_HEIGHT
  };
  if (isHardCover) {
    inches.bleedTop = PRINT_HARDCOVER_PAGE_SIZE.BLEED_TOP;
    inches.bleedBottom = PRINT_HARDCOVER_PAGE_SIZE.BLEED_BOTTOM;
    inches.bleedLeft = HARD_COVER_BLEED_X[pageLimit];
    inches.bleedRight = HARD_COVER_BLEED_X[pageLimit];
  } else {
    inches.bleedTop = PRINT_SOFTCOVER_PAGE_SIZE.BLEED;
    inches.bleedBottom = PRINT_SOFTCOVER_PAGE_SIZE.BLEED;
    inches.bleedLeft = PRINT_SOFTCOVER_PAGE_SIZE.BLEED;
    inches.bleedRight = PRINT_SOFTCOVER_PAGE_SIZE.BLEED;
  }
  inches.pageWidth =
    (inches.sheetWidth - inches.bleedLeft - inches.bleedRight - spineWidth) / 2;
  inches.pageHeight = inches.sheetHeight - inches.bleedTop - inches.bleedBottom;
  const pixels = {
    ...objectInchesToPixels(inches),
    ratio: inches.ratio
  };
  return new SizeSummary(inches, pixels);
};

/**
 * Get Print size for a non-Cover sheet
 *
 * @returns {SizeSummary}  the size summary data {inches, pixels }
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
    bleedTop: PRINT_PAGE_SIZE.BLEED,
    bleedBottom: PRINT_PAGE_SIZE.BLEED,
    bleedLeft: PRINT_PAGE_SIZE.BLEED,
    bleedRight: PRINT_PAGE_SIZE.BLEED,
    ratio: PRINT_PAGE_SIZE.PDF_DOUBLE_WIDTH / PRINT_PAGE_SIZE.PDF_HEIGHT
  };
  const pixels = {
    ...objectInchesToPixels(inches),
    ratio: inches.ratio
  };
  return new SizeSummary(inches, pixels);
};

/**
 * Responsively convert size to a correct scale size base on current DPI
 *
 * @param   {Number}  size - the size pt that need to be converted
 * @returns {Number}  the scaled-size
 */
export const scaleSize = size => (size * PRINT_DPI) / 72;

/**
 * Responsively convert size to a correct scale size base on current DPI
 *
 * @param   {Number}  size - the size px that need to be converted
 * @returns {Number}  the scaled-size
 */
export const unscaleSize = size => (size * 72) / PRINT_DPI;

/**
 * Convert pt to px
 *
 * @param   {Number}  val - the pt value that need to be converted
 * @returns {Number}  the result px
 */
export const ptToPx = val => scaleSize(val);

/**
 * Convert px to pt
 *
 * @param   {Number}  val - the pt value that need to be converted
 * @returns {Number}  the result pt
 */
export const pxToPt = val => unscaleSize(val);

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
  const activeObj = canvas.getActiveObjects();
  if (isEmpty(activeObj)) return;
  activeObj.forEach(object => canvas.remove(object));
  canvas.discardActiveObject().renderAll();
};

/**
 * To reset all objects of current sheet, current use for select layout case
 * @param {Ref} targetCanvas - the canvas want to reset
 */
export const resetObjects = targetCanvas => {
  targetCanvas
    .discardActiveObject()
    .remove(...targetCanvas.getObjects())
    .renderAll();
};
