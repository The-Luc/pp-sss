import { fabric } from 'fabric';

import {
  BOTTOM_CENTER_VALUE,
  BOTTOM_OUTSIDE_CORNERS_VALUE,
  PAGE_NUMBER_POSITION,
  TYPE_PAGE_NUMBER
} from '@/common/constants';
import { ptToPx, pxToIn, mapObject } from '@/common/utils';
import { DEFAULT_RULE_DATA } from '@/common/fabricObjects/common';

/**
 * Adding page number to canvas
 *
 * @param {Object}  spreadInfo        spread info of sheet
 * @param {Object}  pageInfoProp      the property of adding page number
 * @param {Object}  pageNumber        is page number of each page
 * @param {Object}  canvas            the canvas contain new page number
 */
export const addPrintPageNumber = ({
  spreadInfo,
  pageInfoProp,
  pageNumber,
  canvas
}) => {
  const { position, isNumberingOn, ...properties } = pageInfoProp;

  if (!isNumberingOn) return;

  const { width } = canvas;
  const zoom = canvas.getZoom();
  const isBottomCenter = position === PAGE_NUMBER_POSITION.BOTTOM_CENTER;

  const { positionLeft, positionRight } = positionPageNumber(
    isBottomCenter,
    width,
    zoom
  );

  if (spreadInfo?.isLeftNumberOn) {
    const pageNumberLeft = createFabricObject(
      properties,
      positionLeft,
      pageNumber.pageLeftName,
      TYPE_PAGE_NUMBER.LEFT_PAGE_NUMBER
    );
    canvas.add(pageNumberLeft);
  }

  if (spreadInfo?.isRightNumberOn) {
    const pageNumberRight = createFabricObject(
      properties,
      positionRight,
      pageNumber.pageRightName,
      TYPE_PAGE_NUMBER.RIGHT_PAGE_NUMBER
    );
    canvas.add(pageNumberRight);
  }

  canvas.renderAll();
};

/**
 * to create an page number object
 * @param {Object}  prop            page number group
 * @param {Object}  position        position of page number on page
 * @param {String} pageNumber      is page number of on page
 * @param {String}  typePageNumber  is type page number on page
 * @returns fabric page number object
 */
const createFabricObject = (prop, position, pageNumber, typePageNumber) => {
  const fabricProp = toFabricPageNumber({ prop, ...position });
  return new fabric.Text(pageNumber, {
    ...fabricProp,
    type: typePageNumber,
    selectable: false,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * To return position page number
 *
 * @param   {Object}  isBottomCenter  is number page will be added to the bottom center
 * @param   {Number}  canvasWidth     width of canvas
 * @param   {Number}  zoom            zoom of canvas
 * @returns {Object}  position page number
 */
const positionPageNumber = (isBottomCenter, canvasWidth, zoom) => {
  const positionLeft = isBottomCenter
    ? { x: BOTTOM_CENTER_VALUE.LEFT, y: BOTTOM_CENTER_VALUE.TOP }
    : {
        x: BOTTOM_OUTSIDE_CORNERS_VALUE.LEFT,
        y: BOTTOM_OUTSIDE_CORNERS_VALUE.TOP
      };
  const positionRight = isBottomCenter
    ? {
        x: pxToIn(canvasWidth / zoom / 2) + BOTTOM_CENTER_VALUE.LEFT,
        y: BOTTOM_CENTER_VALUE.TOP
      }
    : {
        x: pxToIn(canvasWidth / zoom) - BOTTOM_OUTSIDE_CORNERS_VALUE.LEFT,
        y: BOTTOM_OUTSIDE_CORNERS_VALUE.TOP
      };

  return { positionLeft, positionRight };
};

/**
 * Convert stored properties to fabric properties
 *
 * @param   {Object}  prop  stored properties
 * @returns {Object}        fabric properties
 */
const toFabricPageNumber = prop => {
  const mapRules = {
    data: {
      x: DEFAULT_RULE_DATA.X,
      y: DEFAULT_RULE_DATA.Y,
      color: {
        name: 'fill'
      },
      fontSize: {
        name: 'fontSize',
        parse: value => ptToPx(value)
      }
    },
    restrict: []
  };
  return mapObject(prop, mapRules);
};
/**
 * Update bring to front page number on canvas
 * @param   {Object}  canvas  the canvas
 */
export const updateBringToFrontPageNumber = canvas => {
  const objects = canvas.getObjects();
  Object.values(objects).forEach(obj => {
    if (
      obj.type === TYPE_PAGE_NUMBER.LEFT_PAGE_NUMBER ||
      obj.type === TYPE_PAGE_NUMBER.RIGHT_PAGE_NUMBER
    ) {
      canvas.bringToFront(obj).renderAll();
    }
  });
};
