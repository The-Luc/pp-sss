import { useObjectControlsOverride } from '@/plugins/fabric';
import { applyShadowToObject, handleGetSvgData, updateSpecificProp } from '.';
import { OBJECT_TYPE } from '../constants';

import { addPrintSvgs } from './common';

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
  await addPrintSvgs(
    shapes,
    'pathData',
    canvas,
    isAddedToSinglePage,
    isPlaceInLeftPage,
    eventListeners
  );
};

export const createSvgObject = async objectData => {
  const svgObject = {
    id: objectData.id,
    object: objectData
  };

  const svg = await handleGetSvgData({
    svg: svgObject,
    svgUrlAttrName:
      objectData.type === OBJECT_TYPE.CLIP_ART ? 'vector' : 'pathData',
    expectedHeight: objectData.size.height,
    expectedWidth: objectData.size.width
  });

  const {
    dropShadow,
    shadowBlur,
    shadowOffset,
    shadowOpacity,
    shadowAngle,
    shadowColor
  } = svg;

  updateSpecificProp(svg, {
    coord: {
      rotation: objectData.coord.rotation
    }
  });

  useObjectControlsOverride(svg);

  applyShadowToObject(svg, {
    dropShadow,
    shadowBlur,
    shadowOffset,
    shadowOpacity,
    shadowAngle,
    shadowColor
  });
  return svg;
};
