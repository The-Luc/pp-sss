import { mapObject, convertObjectPxToInch } from '@/common/utils';
import { LAYOUT_PAGE_TYPE } from '@/common/constants/layoutTypes';
import { transitionMapping } from './sheet';

/**
 * Convert layout data from API to FE data structure
 *
 * @param   {Object}  layout layout data from API
 * @returns {Object}        layout data
 */
export const layoutMapping = layout => {
  const doublePageId = LAYOUT_PAGE_TYPE.FULL_PAGE.id;
  const singlePageId = LAYOUT_PAGE_TYPE.SINGLE_PAGE.id;

  const mapRules = {
    data: {
      layout_type: {
        name: 'pageType',
        parse: value => (value === 'DOUBLE_PAGE' ? doublePageId : singlePageId)
      },
      preview_image_url: {
        name: 'previewImageUrl'
      },
      title: {
        name: 'name',
        parse: val => val || 'Untitled'
      }
    },
    restrict: ['layout']
  };

  return mapObject(layout, mapRules);
};

export const digitalLayoutMapping = layout => {
  const mapRules = {
    data: {
      preview_image_url: {
        name: 'previewImageUrl',
        parse: val => val || '',
        isForce: true
      },
      title: {
        name: 'name'
      },
      is_supplemental: {
        name: 'isSupplemental',
        parse: Boolean,
        isForce: true
      }
    },
    restrict: ['digital_frame_templates', 'digital_transitions', '__typename']
  };

  const frames = layout.digital_frame_templates.map(frame => {
    const { objects, play_in_ids, play_out_ids, id } = frame;

    convertObjectPxToInch(objects);

    return {
      id,
      objects,
      playInIds: play_in_ids,
      playOutId: play_out_ids,
      isVisited: true
    };
  });

  const mappedLayout = mapObject(layout, mapRules);

  mappedLayout.frames = frames;

  mappedLayout.transitions = transitionMapping(layout.digital_transitions);

  return mappedLayout;
};
