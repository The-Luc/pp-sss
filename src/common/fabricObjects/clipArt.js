import { DEFAULT_CLIP_ART } from '@/common/constants/defaultProperty';

import { addPrintSvgs } from './common';

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
  await addPrintSvgs(
    clipArts,
    'vector',
    DEFAULT_CLIP_ART.HEIGHT,
    canvas,
    isAddedToSinglePage,
    isPlaceInLeftPage,
    eventListeners
  );
};
