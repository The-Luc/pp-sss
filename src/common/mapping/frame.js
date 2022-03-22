import { mapObject } from '../utils';
import { convertObjectInchToPx, convertObjectPxToInch } from '../utils/objects';
import { cloneDeep } from 'lodash';

/**
 * Convert frame data from API to data can be used in FE
 *
 * @param   {Object}  frameData  frame data from API
 * @returns {Object}        frame data use by model
 */
export const frameMapping = frameData => {
  const frame = cloneDeep(frameData);

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
      }
    },
    restrict: ['play_in_ids', 'play_out_ids']
  };

  convertObjectPxToInch(frame.objects);

  const mappedFrame = mapObject(frame, mapRules);
  const objectIds = mappedFrame.objects.map(o => o.id);

  // remove junk in in play in ids / play out ids
  const removeJunkIds = animationIds => {
    return animationIds.map(ids => ids.filter(id => objectIds.includes(id)));
  };

  mappedFrame.playInIds = removeJunkIds(frame.play_in_ids);
  mappedFrame.playOutIds = removeJunkIds(frame.play_out_ids);

  return mappedFrame;
};

export const mappingFrameToApi = frameData => {
  const frame = cloneDeep(frameData);

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
      },
      fromLayout: {
        name: 'from_layout',
        isForce: true
      }
    },
    restrict: [
      'id',
      'playInIds',
      'playOutIds',
      'objects',
      'supplementalLayoutId'
    ]
  };

  const mapFrame = mapObject(frame, mapRules);

  convertObjectInchToPx(frame.objects);

  mapFrame.objects = frame.objects.map(o => JSON.stringify(o));

  mapFrame.play_in_ids = frame.playInIds;
  mapFrame.play_out_ids = frame.playOutIds;

  return mapFrame;
};
