import { merge } from 'lodash';

import { isEmpty, sortByProperty } from './util';

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
  const sortedFrames = sortByProperty(frames, 'frame_order');

  return sortedFrames.map((frame, index) => {
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

/**
 * Sort frame by order frame
 *
 * @param   {Array} frames      frames data
 * @returns {Array}             frames sorted
 */
export const sortFrameByOrder = frames => {
  return frames.sort((ff, sf) => ff.frame_order - sf.frame_order);
};

/**
 * To get current frames object by combine database frams and current frame on frontend
 *
 * @param {array} dbFrames frames come from database
 * @param {object} frame a current frame on frontend
 * @return {array} array of frames
 */
export const allCurrentFrameObjects = (dbFrames, frame) => {
  const excludeCurrentFrame = dbFrames.filter(f => f.id !== frame.id);

  return [...excludeCurrentFrame, frame].map(f => f.objects).flat();
};
