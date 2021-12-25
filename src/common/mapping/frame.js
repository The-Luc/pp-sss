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
        name: 'fromLayout',
        parse: Boolean,
        isForce: true
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
      previewImageUrl: {
        name: 'preview_image_url'
      }
    },
    restrict: ['id', 'fromLayout', 'playInIds', 'playOutIds', 'objects']
  };

  const mapFrame = mapObject(frame, mapRules);
  mapFrame.objects = frame.objects.map(o => JSON.stringify(o));
  mapFrame.play_in_ids = frame.playInIds;
  mapFrame.play_out_ids = frame.playOutIds;

  return mapFrame;
};
