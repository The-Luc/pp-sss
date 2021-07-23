import { cloneDeep, minBy } from 'lodash';

import { PASTE } from '../constants/config';
import { pxToIn } from './canvas';
import { isHalfLeft, isHalfRight } from './sheet';

/**
 * Function handle get min left and top position in list objects
 * @param {Object} fabricObject Fabric object data
 * @returns {Object} Min left and top position
 */
export const getMinPositionObject = fabricObject => {
  const { type, objects } = fabricObject;

  if (type !== 'activeSelection') {
    return {
      minleft: null,
      minTop: null
    };
  }

  return {
    minLeft: pxToIn(minBy(objects, 'left').left),
    minTop: pxToIn(minBy(objects, 'top').top)
  };
};

/**
 * Compute new coord when user pastes copied object(s) on same spread, the distance between copied objects and pasted objects is 0.5”
 * @param {Object} object Object's data
 * @param {Number} countPaste The paste's count
 * @returns {Object} New x and y coord
 */
const pasteSameSpread = (object, countPaste) => {
  return {
    ...object.coord,
    x: object.coord.x + PASTE.DISTANCE * countPaste,
    y: object.coord.y + PASTE.DISTANCE * countPaste
  };
};

/**
 * Computed coord center of current sheet
 * @param {Object} pageSelected Current page(sheet) selected
 * @param {Element} targetCanvas Target canvas, maybe print or digital, dfault is print
 * @returns {Object} The coord center of current sheet
 */
const getCenterPage = (pageSelected, targetCanvas = window.printCanvas) => {
  const { width, height } = targetCanvas;
  const zoom = targetCanvas.getZoom();

  const pageCenterX = pxToIn(width / zoom) / 2;
  const pageCenterY = pxToIn(height / zoom) / 2;

  const isFrontCover = isHalfRight(pageSelected);
  const isBackCover = isHalfLeft(pageSelected);

  const centerX = pageCenterX * (isFrontCover ? 1.5 : isBackCover ? 0.5 : 1);

  return {
    x: centerX,
    y: pageCenterY
  };
};

/**
 * Compute new coord when user pastes multi objects to new spread and make theme at center of the spread.
 * @param {Object} object Object's data
 * @param {Object} fabricObject Fabric object data
 * @param {Number} minLeft Min left position of list objects
 * @param {Number} minTop Min top position of list objects
 * @param {Object} pageSelected Current page(sheet) selected
 * @returns {Object} New x and y coord
 */
const pasteMultiObjects = (
  object,
  fabricObject,
  minLeft,
  minTop,
  pageSelected
) => {
  const { width, height } = fabricObject;
  const {
    coord: { x: objectX, y: objectY }
  } = object;

  const centerObjectWidth = pxToIn(width) / 2;
  const centerObjectHeight = pxToIn(height) / 2;

  const { x: pageCenterX, y: pageCenterY } = getCenterPage(pageSelected);

  const distanceX = objectX - minLeft;
  const distanceY = objectY - minTop;

  const x = pageCenterX - centerObjectWidth + distanceX;
  const y = pageCenterY - centerObjectHeight + distanceY;

  return {
    ...object.coord,
    x,
    y
  };
};

/**
 * Compute new coord when user pastes single object to new spread and make theme at center of the spread.
 * @param {Object} object Object's data
 * @param {Object} pageSelected Current page(sheet) selected
 * @returns {Object} New x and y coord
 */
const pasteSingleObject = (object, pageSelected) => {
  const {
    size: { width, height }
  } = object;

  const centerObjectWidth = width / 2;
  const centerObjectHeight = height / 2;

  const { x: pageCenterX, y: pageCenterY } = getCenterPage(pageSelected);

  const x = pageCenterX - centerObjectWidth;
  const y = pageCenterY - centerObjectHeight;

  return {
    ...object.coord,
    x,
    y
  };
};

/**
 * Function handle user pastes copied object(s) to new spread
 * @param {Object} object Object's data
 * @param {Object} fabricObject Fabric object data
 * @param {Number} minLeft Min left position of list objects
 * @param {Number} minTop Min top position of list objects
 * @returns {Object} New x and y coord
 */
const pasteToNewSpread = (
  object,
  fabricObject,
  minLeft,
  minTop,
  pageSelected
) => {
  if (fabricObject.type === 'activeSelection') {
    return pasteMultiObjects(
      object,
      fabricObject,
      minLeft,
      minTop,
      pageSelected
    );
  }
  return pasteSingleObject(object, pageSelected);
};

/**
 * Function handle compute pasted object's coord
 * @param {Object} data Paste object
 * @param {Number} sheetId Sheet's id of object copied
 * @param {Object} fabricObject Fabric object data
 * @param {Number} minLeft Min left position of list objects
 * @param {Number} minTop Min top position of list objects
 * @param {Object} pageSelected Current sheet selected
 * @param {Number} countPaste The paste's count
 * @returns {Object} New object coord after caculated
 */
export const computePastedObjectCoord = (
  data,
  sheetId,
  fabricObject,
  minLeft,
  minTop,
  pageSelected,
  countPaste,
  isDigital = false
) => {
  const isSameSpread = sheetId === pageSelected.id;
  const object = cloneDeep(data);

  if (isSameSpread || isDigital) {
    return pasteSameSpread(object, countPaste);
  }

  return pasteToNewSpread(object, fabricObject, minLeft, minTop, pageSelected);
};
