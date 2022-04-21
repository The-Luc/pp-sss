import { useObjectControlsOverride } from '@/plugins/fabric';
import {
  addCliparts,
  applyShadowToObject,
  handleGetClipart,
  updateSpecificProp
} from '.';

/**
 * Adding clip art to canvas
 *
 * @param {Array}   clipArts            list of clip arts will be added
 * @param {Object}  canvas              the canvas contain new clip arts
 * @param {Boolean} isAddedToSinglePage is clip art will be added to single page
 * @param {Boolean} isPlaceInLeftPage   is clip art will be added to left page
 * @param {Object}  eventListeners      clip art event list {name, eventHandling}
 */
export const addPrintClipArts = async (
  clipArts,
  canvas,
  isAddedToSinglePage = false,
  isPlaceInLeftPage = false,
  eventListeners = {}
) => {
  await addCliparts(
    clipArts,
    canvas,
    isAddedToSinglePage,
    isPlaceInLeftPage,
    eventListeners
  );
};

export const createClipartObject = async objectData => {
  const clipart = await handleGetClipart({
    object: objectData,
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
  } = clipart;

  updateSpecificProp(clipart, {
    coord: {
      rotation: objectData.coord.rotation
    }
  });

  useObjectControlsOverride(clipart);

  applyShadowToObject(clipart, {
    dropShadow,
    shadowBlur,
    shadowOffset,
    shadowOpacity,
    shadowAngle,
    shadowColor
  });
  return clipart;
};
