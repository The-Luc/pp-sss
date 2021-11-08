import { mapObject } from '@/common/utils';

import { POSITION_FIXED, SHEET_TYPE } from '@/common/constants';

/**
 * Convert sheet data from API to data of Sheet Model
 *
 * @param   {Object}  sheet sheet data from API
 * @returns {Object}        sheet data use by model
 */
export const sheetMapping = sheet => {
  const mapRules = {
    data: {
      sheet_type: {
        name: 'type',
        parse: value => SHEET_TYPE[value]
      },
      fixed_position: {
        name: 'positionFixed',
        parse: value => POSITION_FIXED[value.replace(/(POSITION_)/g, '')]
      },
      is_visited: {
        name: 'isVisited'
      }
    },
    restrict: ['pages', 'digital_frames']
  };

  return mapObject(sheet, mapRules);
};

/**
 * Convert sheet data from model to data API
 * @param   {Object}  sheet sheet data use by model
 * @returns {Object}        sheet data from API
 */
export const sheetMappingToApi = sheet => {
  const mappingPosition = {
    [POSITION_FIXED.NONE]: 'POSITION_NONE',
    [POSITION_FIXED.FIRST]: 'POSITION_FIRST',
    [POSITION_FIXED.LAST]: 'POSITION_LAST',
    [POSITION_FIXED.ALL]: 'POSITION_ALL'
  };

  const mappingType = {
    [SHEET_TYPE.COVER]: 'COVER',
    [SHEET_TYPE.FRONT_COVER]: 'FRONT_COVER',
    [SHEET_TYPE.BACK_COVER]: 'BACK_COVER',
    [SHEET_TYPE.NORMAL]: 'NORMAL'
  };

  const mapRules = {
    data: {
      type: {
        name: 'sheet_type',
        parse: value => mappingType[value]
      },
      positionFixed: {
        name: 'fixed_position',
        parse: value => mappingPosition[value]
      },
      isVisited: {
        name: 'is_visited'
      }
    },
    restrict: ['id', 'sectionId']
  };

  return mapObject(sheet, mapRules);
};
