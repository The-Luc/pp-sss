import { mapObject } from '@/common/utils';
import { LAYOUT_PAGE_TYPE } from '@/common/constants/layoutTypes';

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
      }
    },
    restrict: ['layout']
  };

  return mapObject(layout, mapRules);
};
