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

export const mappingFrameToApi = frame => {
  const mapRules = {
    data: {
      delay: {
        name: 'frame_delay'
      },
      isVisited: {
        name: 'is_visited'
      },
      playInIds: {
        name: 'play_in_ids',
        noSub: true
      },
      playOutIds: {
        name: 'play_out_ids',
        noSub: true
      },
      previewImageUrl: {
        name: 'preview_image_url'
      }
    },
    restrict: [
      'id',
      'fromLayout',
      'playInIds',
      'playOutIds',
      'previewImageUrl',
      'objects'
    ]
  };

  return mapObject(frame, mapRules);
};
