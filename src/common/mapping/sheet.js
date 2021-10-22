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
      }
    },
    restrict: []
  };

  return mapObject(sheet, mapRules);
};
