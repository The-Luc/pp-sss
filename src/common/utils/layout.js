import { cloneDeep } from 'lodash';
import {
  CUSTOM_LAYOUT_TYPE,
  LAYOUT_PAGE_TYPE,
  OBJECT_TYPE,
  SHEET_TYPE
} from '../constants';
import { pxToIn } from './canvas';
import { isEmpty } from './util';

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
  const layout = listLayouts.find(layout => layout.id === layoutId);

  const layoutType = listLayoutType.find(({ value }) => value === layout.type);

  if (!isEmpty(layoutType)) return layoutType;

  const layoutOpt = listLayoutType.find(
    layout => layout.value === CUSTOM_LAYOUT_TYPE
  );

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
 * @param {*} position left or right || FRONT_COVER or BACK_COVER
 * @returns an object have coords changed
 */
export const changeObjectsCoords = (objects, position) => {
  const isLeftPage = position === 'left' || position === SHEET_TYPE.BACK_COVER;

  const newObjects = cloneDeep(objects);
  const { width } = window.printCanvas;
  const zoom = window.printCanvas.getZoom();
  const midCanvas = pxToIn(width / zoom / 2);

  newObjects.forEach(object => {
    if (object.type === OBJECT_TYPE.BACKGROUND) return;

    const left = object.coord.x;

    const isAddToLeft = !isLeftPage && left < midCanvas;

    const isRemoveFromLeft = isLeftPage && left > midCanvas;

    const extraValue = isAddToLeft
      ? midCanvas
      : isRemoveFromLeft
      ? -midCanvas
      : 0;

    object.coord.x = left + extraValue;
  });

  return newObjects;
};
