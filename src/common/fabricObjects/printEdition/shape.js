import { DEFAULT_SHAPE } from '@/common/constants/defaultProperty';

import { isEmpty } from '@/common/utils';

import {
  updateElement,
  getSvgData,
  addSingleSvg,
  addMultiSvg,
  toFabricShapeProp
} from '../common';

/**
 * Adding shapes to canvas
 *
 * @param {Array}   shapes              list of shape will be added
 * @param {Object}  canvas              the canvas contain new shapes
 * @param {Boolean} isAddedToSinglePage is shape will be added to single page
 * @param {Boolean} isPlaceInLeftPage   is shape will be added to left page
 */
export const addPrintShapes = async (
  shapes,
  canvas,
  isAddedToSinglePage = false,
  isPlaceInLeftPage = false
) => {
  const zoom = canvas.getZoom();

  const svgs = await Promise.all(
    shapes.map(s => {
      const fabricProp = toFabricShapeProp(s.object);

      return getSvgData(
        s.object.property.pathData,
        { ...fabricProp, id: s.id },
        DEFAULT_SHAPE.HEIGHT,
        zoom
      );
    })
  );

  if (isEmpty(svgs) || svgs.length != shapes.length) return;

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
