import { mapObject } from '../utils';

/**
 * Convert frame data from API to data can be used in FE
 *
 * @param   {Object}  frame  frame data from API
 * @returns {Object}        frame data use by model
 */
export const frameMapping = frame => {
  const mapRules = {
    data: {
      id: {
        name: 'id',
        parse: value => value
      },
      frame_delay: {
        name: 'delay'
      },
      from_layout: {
        name: 'fromLayout'
      },
      is_visited: {
        name: 'isVisited'
      },
      preview_image_url: {
        name: 'previewImageUrl'
      },
      play_in_ids: {
        name: 'playInIds'
      },
      play_out_ids: {
        name: 'playOutIds'
      }
    },
    restrict: []
  };

  return mapObject(frame, mapRules);
};
