import { fabric } from 'fabric';

import { DEFAULT_SHAPE } from '@/common/constants/defaultProperty';

import { isEmpty, scaleSize } from '@/common/utils';

import { updateElement, toFabricShapeProp } from '../common';

/**
 * Get svg data of shape
 *
 * @param {Number}  id      id of shape
 * @param {Object}  shape   the shape will be added
 * @param {Number}  zoom    current zoom of canvas
 */
const getSvgData = async (id, shape, zoom) => {
  const fabricProp = toFabricShapeProp(shape);

  return new Promise(resolve => {
    fabric.loadSVGFromURL(shape.property.pathData, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);

      const scale = scaleSize(DEFAULT_SHAPE.HEIGHT) / zoom / svg.height;

      svg.set({
        ...fabricProp,
        id,
        width: svg.width,
        height: svg.height,
        scaleX: scale,
        scaleY: scale
      });

      resolve(svg);
    });
  });
};

/**
 * Adding shape to canvas
 *
 * @param {Object}  svg     svg data of will be added shape
 * @param {Object}  canvas  the canvas contain new shape
 */
const addSingleShape = (svg, canvas) => {
  canvas.add(svg);

  canvas.bringToFront(svg);

  svg.viewportCenter().setCoords();
};

/**
 * Adding shapes to canvas
 *
 * @param {Array}   svgs    list of svg data of will be added shape
 * @param {Object}  canvas  the canvas contain new shapes
 */
const addMultiShapes = (svgs, canvas) => {
  let left = 0;

  svgs.forEach(s => {
    s.set({ left });

    left += s.width * s.scaleX;
  });

  const group = new fabric.Group(svgs, {
    originX: 'center',
    originY: 'center'
  });

  group.setCoords();

  canvas.add(group);

  group.viewportCenter().setCoords();

  group.getObjects().forEach(item => {
    canvas.add(item);

    canvas.bringToFront(item);
  });

  group.destroy();

  canvas.remove(group);
};

/**
 * Adding shapes to canvas
 *
 * @param {Array}   shapes  list of shape will be added
 * @param {Object}  canvas  the canvas contain new shapes
 */
export const addPrintShapes = async (shapes, canvas) => {
  const zoom = window.printCanvas.getZoom();

  const svgs = await Promise.all(
    shapes.map(s => {
      return getSvgData(s.id, s.object, zoom);
    })
  );

  if (isEmpty(svgs) || svgs.length != shapes.length) return;

  svgs.length == 1
    ? addSingleShape(svgs[0], canvas)
    : addMultiShapes(svgs, canvas);

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
