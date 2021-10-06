import { BORDER_STYLES, CANVAS_BORDER_TYPE } from '@/common/constants';
import { scaleSize } from './canvas';

/**
 * Calculate dashArray for rect
 *
 * @param   {Number}  width  - the width need to calc
 * @param   {Number}  height  - the height need to calc
 * @param   {String}  strokeType  current stroke type
 * @param   {Number}  strokeWidth  current stroke width
 * @returns {Array<Number>} dashArray
 */
export const getRectDashes = (width, height, strokeType, strokeWidth) => {
  if (!strokeWidth) {
    return [];
  }
  let dashArray = [];
  if (strokeType === BORDER_STYLES.ROUND) {
    dashArray = getRoundDashes(width, height, strokeWidth);
  } else if (strokeType === BORDER_STYLES.SQUARE) {
    const dashLength = Math.min(Math.min(width, height) * 0.1, 100);

    const widthArray = getLineDashes(width, 0, 0, 0, dashLength);
    const heightArray = getLineDashes(0, height, 0, 0, dashLength);
    dashArray = [widthArray, 0, heightArray, 0, widthArray, 0, heightArray];
  }
  return [].concat(...dashArray);
};

/**
 * Calculate dashArray for rect of portrait image
 *
 * @param   {Number}  width  - the width need to calc
 * @param   {Number}  height  - the height need to calc
 * @param   {String}  strokeType  current stroke type
 * @param   {Number}  strokeWidth  current stroke width
 * @param   {Number}  perimeter  perimeter of object
 * @returns {Array<Number>} dashArray
 */
export const getRectDashesForPortrait = (
  width,
  height,
  strokeType,
  strokeWidth,
  perimeter
) => {
  if (!strokeWidth) return [];

  if (strokeType === BORDER_STYLES.ROUND)
    return calcRoundDash(perimeter, strokeWidth);

  if (strokeType === BORDER_STYLES.SQUARE) {
    const dashLength = Math.min(Math.min(width, height) * 0.1, 100);

    return getLineDashes(perimeter, 0, 0, 0, dashLength, true);
  }
};

/**
 * Calculate dashArray repeat base on number of points and dashTemplate
 *
 * @param   {Number}  points  - the length need to calc
 * @param   {Array<Number>}  dashTemplate  current stroke width
 * @returns {Array<Number>} dashArray
 */
const calcDashArray = (points, dashTemplate) => {
  return Array.from({ length: points }).reduce(arr => {
    arr.push(...dashTemplate);
    return arr;
  }, []);
};

/**
 * Calculate dashArray for 1 side of border
 *
 * @param   {Number}  width  - the length need to calc
 * @param   {Number}  strokeWidth  current stroke width
 * @returns {Array<Number>} dashArray for current side
 */
const calcRoundDash = (width, strokeWidth) => {
  let baseSpace = strokeWidth * 2;
  const spaceDivision = width / baseSpace;
  const countDash = Math.floor(spaceDivision);

  if (spaceDivision >= 1.5 && countDash <= 2) {
    return [0, width / 2, 0, width / 2];
  }

  if (countDash <= 1) {
    return [0, width];
  }

  const extra = width % baseSpace;
  baseSpace += extra / countDash;

  return calcDashArray(countDash, [0, baseSpace]);
};

/**
 * Calculate points of rounded border
 *
 * @param   {Number}  width  Width of element
 * @param   {Number}  height  Height of element
 * @param   {Number}  strokeWidth  current stroke width
 * @returns {Array<Number>} dashArray for round dash
 */
const getRoundDashes = (width, height, strokeWidth) => {
  const dashX = calcRoundDash(width, strokeWidth);
  const dashY = calcRoundDash(height, strokeWidth);

  return [...dashX, ...dashY, ...dashX, ...dashY];
};

// same as previous snippet except that it does return all the segment's dashes
const getLineDashes = (x1, y1, x2, y2, dashLength, isSelfClosed) => {
  const length = Math.hypot(x2 - x1, y2 - y1) + 2; // calc distance between two points

  const gapLength = dashLength;
  const { totalBars, numDashes } = calcDashNumber(
    length,
    dashLength,
    isSelfClosed
  );

  const calcLineLength = totalBars * dashLength;
  const remaining = length - calcLineLength;
  const acctualDashLength = remaining / numDashes + dashLength;

  return Array(totalBars)
    .fill(0)
    .map((_, idx) => (idx % 2 === 0 ? acctualDashLength : gapLength));
};

/**
 * To calculate number of dash of particular line
 *
 * @param {Number} length length of dashed line
 * @param {Number} dashLength length of a dash
 * @param {Boolean} isSelfClosed whether it a opened-line or enclosed line
 * @returns {Object} total number of dashes and gaps, number of dashes
 */
const calcDashNumber = (length, dashLength, isSelfClosed) => {
  const dashNumber = Math.floor(length / dashLength);
  const isEven = dashNumber % 2 === 0;

  if (isSelfClosed) {
    const totalBars = isEven ? dashNumber : dashNumber + 1;
    const numDashes = totalBars / 2;
    return { totalBars, numDashes };
  }

  const totalBars = isEven ? dashNumber + 1 : dashNumber;
  const numDashes = Math.ceil(totalBars / 2);
  return { totalBars, numDashes };
};

export const getStrokeLineCap = strokeType => {
  if (BORDER_STYLES.ROUND === strokeType) {
    return strokeType;
  }
  return CANVAS_BORDER_TYPE.BUTT;
};

/**
 * Get border data from store and set to Rect object
 */
export const setBorderObject = (rectObj, objectData) => {
  const {
    border: { strokeWidth, stroke, strokeLineType }
  } = objectData;

  const strokeLineCap = getStrokeLineCap(strokeLineType);

  rectObj.set({
    strokeWidth: scaleSize(strokeWidth),
    stroke,
    strokeLineCap,
    strokeLineType
  });

  setTimeout(() => {
    rectObj.canvas.renderAll();
  });
};

/**
 * Set border color when selected group object
 * @param {Element}  group  Group object
 * @param {Object}  sheetLayout  current layout of canvas
 */
export const setBorderHighlight = (group, sheetLayout) => {
  group.set({
    borderColor: sheetLayout?.id ? 'white' : '#bcbec0'
  });
};
