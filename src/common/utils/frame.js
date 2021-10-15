import { merge } from 'lodash';

import { isEmpty } from './util';

/**
 * Get playback data from frames & transitions
 *
 * @param   {Array} frames      frames data
 * @param   {Array} transitions transitions data
 * @param   {Array} currentData current playback data
 * @returns {Array}             playback data
 */
export const getPlaybackDataFromFrames = (
  frames,
  transitions,
  currentData = []
) => {
  return frames.map((frame, index) => {
    const id = frame.id;
    const transition = isEmpty(transitions[index]) ? {} : transitions[index];

    const data = currentData.find(d => d.id === `${id}`);

    if (!isEmpty(data)) {
      return merge(data, { transition: { ...transition } });
    }

    const { objects, playInIds, playOutIds, delay } = frame;

    return {
      id: `${id}`,
      objects,
      playInIds,
      playOutIds,
      delay,
      transition
    };
  });
};
