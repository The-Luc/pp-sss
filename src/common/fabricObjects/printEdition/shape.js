import { DEFAULT_SHAPE } from '@/common/constants/defaultProperty';

import { isEmpty } from '@/common/utils';

import {
  updateElement,
  getSvgData,
  addSingleSvg,
  addMultiSvg,
  toFabricShapeProp,
  addEventListeners
} from '../common';

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
  const svgs = await Promise.all(
    shapes.map(s => {
      const fabricProp = toFabricShapeProp(s.object);

      return getSvgData(
        s.object.pathData,
        { ...fabricProp, id: s.id },
        DEFAULT_SHAPE.HEIGHT
      );
    })
  );

  if (isEmpty(svgs) || svgs.length != shapes.length) return;

  svgs.forEach(s => addEventListeners(s, eventListeners));

  svgs.length == 1
    ? addSingleSvg(svgs[0], canvas, isAddedToSinglePage, isPlaceInLeftPage)
    : addMultiSvg(svgs, canvas, isAddedToSinglePage, isPlaceInLeftPage);

  canvas.renderAll();
};

/**
 * Change property of shape
 *
 * @param {Object}  shape   the shape will be change property
 * @param {Object}  prop    new property
 * @param {Object}  canvas  the canvas contain shape
 */
export const updatePrintShape = (shape, prop, canvas) => {
  updateElement(shape, prop, canvas);
};
