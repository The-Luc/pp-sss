import { DEFAULT_SHAPE } from '@/common/constants/defaultProperty';

import { addPrintSvgs } from '../common';

/**
 * Adding shapes to canvas
 *
 * @param {Array}   shapes              list of shape will be added
 * @param {Object}  canvas              the canvas contain new shapes
 * @param {Boolean} isAddedToSinglePage is shape will be added to single page
 * @param {Boolean} isPlaceInLeftPage   is shape will be added to left page
 * @param {Object}  eventListeners      shape event list {name, eventHandling}
 */
export const addPrintShapes = async (
  shapes,
  canvas,
  isAddedToSinglePage = false,
  isPlaceInLeftPage = false,
  eventListeners = {}
) => {
  return await addPrintSvgs(
    shapes,
    'pathData',
    DEFAULT_SHAPE.HEIGHT,
    canvas,
    isAddedToSinglePage,
    isPlaceInLeftPage,
    eventListeners
  );
};
