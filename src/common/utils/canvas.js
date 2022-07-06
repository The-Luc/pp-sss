import { fabric } from 'fabric';

import {
  PRINT_HARDCOVER_PAGE_SIZE,
  PRINT_SOFTCOVER_PAGE_SIZE,
  HARDCOVER_SPINE_SIZES,
  HARD_COVER_BLEED_X,
  SOFTCOVER_SPINE_SIZES,
  PRINT_DPI,
  DIGITAL_DPI,
  PRINT_PAGE_SIZE,
  PAGE_NUMBER_TYPE,
  EDITION,
  SHEET_TYPE
} from '@/common/constants';
import { SizeSummary } from '@/common/models';
import { isEmpty } from './util';

let activeEdition = null;
let activeCanvas = null;

const getDpi = () => {
  const isDigitalEdition = activeEdition === EDITION.DIGITAL;

  return isDigitalEdition ? DIGITAL_DPI : PRINT_DPI;
};

export const setActiveEdition = (canvas, edition) => {
  activeEdition = edition;
  activeCanvas = canvas;
};

export const getActiveCanvas = () => {
  return activeCanvas;
};

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
export const scaleSize = size => (size * getDpi()) / 72;

/**
 * Responsively convert size to a correct scale size base on current DPI
 *
 * @param   {Number}  size - the size px that need to be converted
 * @returns {Number}  the scaled-size
 * @returns {Number}  the custom dpi value
 */
export const unscaleSize = (size, dpi) =>
  dpi ? (size * 72) / dpi : (size * 72) / getDpi();

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
 * @returns {Number}  the custom dpi value
 */
export const pxToPt = (val, dpi) => unscaleSize(val, dpi);

/**
 * Conver inch to px
 *
 * @param   {Number}  val - the inch value that need to be converted
 * @param   {Number}  the custom dpi value
 * @returns {Number}  the result px
 */
export const inToPx = (val, dpi) => (dpi ? val * dpi : val * getDpi());

/**
 * Conver px to inch
 *
 * @param   {Number}  val - the px value that need to be converted
 * @returns {Number}  the result inch
 * @returns {Number}  the custom dpi value
 */
export const pxToIn = (val, dpi) => (dpi ? val / dpi : val / getDpi());

/**
 * To select the last object added into canvas
 * @param {Any} canvas - the canvas to check
 */
export const selectLatestObject = canvas => {
  const lastestObject = [
    ...canvas
      .getObjects()
      .filter(
        obj =>
          ![
            PAGE_NUMBER_TYPE.LEFT_PAGE_NUMBER,
            PAGE_NUMBER_TYPE.RIGHT_PAGE_NUMBER
          ].includes(obj.objectType)
      )
  ].pop();

  canvas.setActiveObject(lastestObject);
  canvas.renderAll();
};

/**
 * To delete all selected objects in the provided canvas
 * @param {Any} canvas - the canvas to check
 */
export const deleteSelectedObjects = canvas => {
  const activeObj = canvas?.getActiveObjects();

  if (isEmpty(activeObj)) return;

  activeObj.forEach(object => {
    if (object.dispose) object.dispose();

    canvas.remove(object);
  });

  canvas.discardActiveObject().renderAll();
};

/**
 * To reset all objects of current sheet, current use for select layout case
 */
export const resetObjects = canvas => {
  const targetCanvas = canvas || getActiveCanvas();
  targetCanvas
    .discardActiveObject()
    .remove(...targetCanvas.getObjects())
    .renderAll();
};

/**
 * Get current coord of mouse when user move and check has within canvas or not
 * @param {Number} clientX - Current coord x when user move mouse
 * @param {Number} clientY - Current coord y when user move mouse
 * @param {Number} top - Canvas's top position
 * @param {Number} left - Canvas's left position
 * @param {Number} width - Canvas' width
 * @param {Number} height - Canvas' height
 * @returns {Object} {x, y, visible}
 * @property {Number} x Current x of mouse
 * @property {Number} y Current y of mouse
 * @property {Boolean} visible Is moving within canvas ?
 */
const getDataMouseMoveWithinCanvas = (
  clientX,
  clientY,
  top,
  left,
  width,
  height
) => {
  const x = clientX - left;
  const y = clientY - top;

  const visible = x > 0 && y > 0 && width - x > 0 && height - y > 0;

  return {
    x,
    y,
    visible
  };
};

/**
 * Get color code when user move cursor to object
 * @param {Object} canvas - Target canvas want to get color
 * @param {Event} e - Event mouse move
 * @returns {String} Color code
 */
export const getCanvasColor = (canvas, e) => {
  const ctx = canvas.contextContainer;
  const pointer = canvas.getPointer(e);

  const imageData = ctx.getImageData(
    Math.round(
      (pointer.x - 60 + canvas.viewportTransform[4]) *
        fabric.devicePixelRatio *
        canvas.getZoom()
    ),
    Math.round(
      (pointer.y + canvas.viewportTransform[5]) *
        fabric.devicePixelRatio *
        canvas.getZoom()
    ),
    1,
    1
  );

  let { data } = imageData;

  // Made opaque canvas
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
};

/**
 * Handle action user move mouse
 * @param {Object} event Event mouse move
 * @param {Number} event.clientX Current mouse x position
 * @param {Number} event.clienclientYtX Current mouse y position
 * @returns {Object} {x, y, visible, canvas}
 * @property {Number} x Current x of mouse
 * @property {Number} y Current y of mouse
 * @property {Boolean} visible Is moving within canvas ?
 * @property {Object} canvas Canvas element
 */
export const handleBodyMouseMove = ({ clientX, clientY }) => {
  const canvas = window.printCanvas || window.digitalCanvas;

  if (canvas) {
    const {
      top,
      left,
      width,
      height
    } = canvas.lowerCanvasEl.getBoundingClientRect();

    const { x, y, visible } = getDataMouseMoveWithinCanvas(
      clientX,
      clientY,
      top,
      left,
      width,
      height
    );

    return {
      x,
      y,
      visible,
      canvas,
      width
    };
  }
};

/**
 * Check editting active object
 */
export const isEditingActiveObject = () => {
  const activeObj = getActiveCanvas()?.getActiveObject();

  return !!activeObj?.isEditing;
};

export const activeCanvasInfo = () => {
  const targetCanvas = getActiveCanvas();
  const { width, height } = targetCanvas;
  const zoom = targetCanvas.getZoom();

  const mid = pxToIn(width / zoom / 2);
  const actualWidth = pxToIn(width / zoom);
  const actualHeight = pxToIn(height / zoom);

  return { mid, width: actualWidth, height: actualHeight };
};

/**
 * Get print canvas size
 *
 * @param {sheetType} Number type of sheet | Cover, front cover, back cover, normal
 * @param {isHardCover} Boolean whether the book is hard cover book
 *
 * @return {sheetWidth, sheetHeight}
 */
export const getPrintCanvasSize = (sheetType, isHardCover) => {
  const isCover = sheetType === SHEET_TYPE.COVER;
  const { sheetWidth, sheetHeight } = isCover
    ? getCoverPagePrintSize(isHardCover).inches
    : getPagePrintSize().inches;

  return { sheetWidth, sheetHeight };
};
