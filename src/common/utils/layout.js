import { cloneDeep, get } from 'lodash';
import { getActiveCanvas, pxToIn } from './canvas';
import {
  CUSTOM_LAYOUT_TYPE,
  LAYOUT_PAGE_TYPE,
  OBJECT_TYPE,
  SHEET_TYPE
} from '../constants';
import { isEmpty } from './util';
import {
  BackgroundElementObject,
  ClipArtElementObject,
  ImageElementObject,
  TextElementObject
} from '../models/element';
import { getPagePrintSize, pxToPt } from '.';

/**
 * Get layout option from list layouts option by id
 *
 * @param   {Array} listLayouts - List layouts. It include themeId, layout type
 * @param   {Array} listLayoutType - List layout option of select
 * @param   {Number} layoutId - Layout id of sheet
 * @returns {Object} Object layout option
 */
export const getLayoutOptSelectedById = (
  listLayouts,
  listLayoutType,
  layoutId
) => {
  const layout = listLayouts.find(l => l.id === layoutId);

  const layoutType = listLayoutType.find(({ value }) => value === layout.type);

  if (!isEmpty(layoutType)) return layoutType;

  const layoutOpt = listLayoutType.find(l => l.value === CUSTOM_LAYOUT_TYPE);

  const indexSubItem =
    layout.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id ? 0 : 1;

  return {
    value: layoutOpt.value,
    sub: layoutOpt.subItems[indexSubItem]
  };
};

/**
 *  to change objects coords to fit the side that use what to render them
 * @param {Object} objects that will be change their coord to place in the right side (left/right)
 * @param {Number | String} position left or right || FRONT_COVER or BACK_COVER
 * @returns an object have coords changed
 */
export const changeObjectsCoords = (objects, position) => {
  const isLeftPage = position === 'left' || position === SHEET_TYPE.BACK_COVER;

  const newObjects = cloneDeep(objects);

  if (isLeftPage) return newObjects;

  const targetCanvas = getActiveCanvas();
  const { width } = targetCanvas;
  const zoom = targetCanvas.getZoom();
  const midCanvas = pxToIn(width / zoom / 2);

  newObjects.forEach(object => {
    if (object.type === OBJECT_TYPE.BACKGROUND) return;

    object.coord.x += midCanvas;
  });

  return newObjects;
};

export const createTextElement = (element, isRightPage) => {
  const id = get(element, 'properties.guid', '');
  const text = get(element, 'text.properties.text', '');
  const { font_size, text_aligment: alignment } = get(element, 'text.view', {});

  return new TextElementObject({
    ...getElementDimension(element, isRightPage),
    id,
    text,
    fontSize: pxToPt(font_size),
    alignment
  });
};

export const createImageElement = (element, isRightPage) => {
  const id = get(element, 'properties.guid', '');
  const { properties } = element?.picture || {};
  const imageUrl = properties?.url?.startsWith('http') ? properties?.url : '';

  return new ImageElementObject({
    ...getElementDimension(element, isRightPage),
    id,
    imageUrl
  });
};

export const createClipartElement = (element, isRightPage) => {
  const { vector = '', guid: id } = element?.properties || {};

  return new ClipArtElementObject({
    ...getElementDimension(element, isRightPage),
    id,
    vector
  });
};

export const createBackgroundElement = page => {
  const imageUrl = get(page, 'layout.view.background.image_url', '');

  return new BackgroundElementObject({
    imageUrl
  });
};

const getElementDimension = (element, isRightPage) => {
  const {
    size: { width, height },
    position: { top, left },
    opacity
  } = element?.view || {};

  const { pageWidth } = getPagePrintSize().inches;

  const size = {
    width: pxToIn(width),
    height: pxToIn(height)
  };

  const coord = {
    x: isRightPage ? pxToIn(left) + pageWidth : pxToIn(left),
    y: pxToIn(top)
  };

  return { size, coord, opacity };
};
