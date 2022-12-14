import { mapObject, convertObjectPxToInch, isEmpty } from '@/common/utils';
import { LAYOUT_PAGE_TYPE } from '@/common/constants/layoutTypes';
import { transitionMapping } from './sheet';
import { cloneDeep, get } from 'lodash';

export const layoutElementMappings = (layout, isDigital) => {
  const tempMappings = layout?.template_element_mappings;

  if (isEmpty(tempMappings)) return;

  const elementMappings = tempMappings.map(o => ({
    id: o.id,
    printElementId: o.print_element_uid,
    digitalElementId: o.digital_element_uid
  }));

  const path = isDigital
    ? 'template'
    : 'digital_frame_template.digital_template';

  const theOtherLayoutId = get(tempMappings, `[0].${path}.id`);
  const theOtherLayoutTitle = get(tempMappings, `[0].${path}.title`, 'Unknown');

  return {
    theOtherLayoutId,
    theOtherLayoutTitle,
    elementMappings
  };
};

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
      },
      layout_use: {
        name: 'type',
        parse: val => val || 'MISC',
        isForce: true
      }
    },
    restrict: ['layout', 'template_element_mappings']
  };

  const mapLayout = mapObject(layout, mapRules);

  mapLayout.mappings = layoutElementMappings(layout);

  return mapLayout;
};

export const digitalLayoutMapping = layoutData => {
  const layout = cloneDeep(layoutData);

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
      },
      layout_use: {
        name: 'layoutUse',
        parse: val => val || 'MISC',
        isForce: true
      },
      layout_type: {
        name: 'layoutType'
      }
    },
    restrict: ['digital_frame_templates', 'digital_transitions', '__typename']
  };

  const mappedLayout = mapObject(layout, mapRules);

  if (isEmpty(layout.digital_frame_templates)) {
    return mappedLayout;
  }

  const frames = layout.digital_frame_templates.map(frame => {
    const { objects, play_in_ids, play_out_ids, id, preview_image_url } = frame;

    convertObjectPxToInch(objects);

    return {
      id,
      objects,
      playInIds: play_in_ids,
      playOutIds: play_out_ids,
      isVisited: true,
      previewImageUrl: preview_image_url || ''
    };
  });

  if (layout.digital_transitions) {
    const transitions = layout.digital_transitions.map(t =>
      transitionMapping(t)
    );
    frames.forEach((f, idx) => (f.transition = transitions[idx]));
  }

  mappedLayout.frames = frames;

  const tmpLayout = {};
  tmpLayout.template_element_mappings = layout.digital_frame_templates
    .map(f => f.template_element_mappings)
    .flat()
    .filter(Boolean);

  mappedLayout.mappings = layoutElementMappings(tmpLayout, true);

  return mappedLayout;
};
