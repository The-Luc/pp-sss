import { mapObject } from '@/common/utils';

import {
  LINK_STATUS,
  POSITION_FIXED,
  SHEET_TYPE,
  TRANSITION,
  ANIMATION_DIR
} from '@/common/constants';

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
      },
      linked: {
        name: 'link',
        parse: value => {
          if (sheet.sheet_type !== 'NORMAL') return LINK_STATUS.NONE;

          return value ? LINK_STATUS.LINK : LINK_STATUS.UNLINK;
        }
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
      },
      order: {
        name: 'sheet_order'
      },
      link: {
        name: 'linked',
        parse: value => value === LINK_STATUS.LINK
      }
    },
    restrict: ['id', 'sectionId']
  };

  return mapObject(sheet, mapRules);
};

/**
 * Convert transition data from API to data of Transition Model
 *
 * @param   {Object}  transition transition data from API
 * @returns {Object}        transition data use by model
 */
export const transitionMapping = transition => {
  const mapRules = {
    data: {
      transition_type: {
        name: 'transition',
        parse: value => TRANSITION[value === 'NO_TRANSITION' ? 'NONE' : value]
      },
      direction: {
        name: 'direction',
        parse: value => ANIMATION_DIR[value]
      }
    },
    restrict: ['sheet', 'transition_order']
  };

  return mapObject(transition, mapRules);
};

/**
 * Convert transition data from model to data API
 * @param   {Object}  transition transition data use by model
 * @returns {Object}        transition data from API
 */
export const transitionMappingToApi = transition => {
  const mapRules = {
    data: {
      transition: {
        name: 'transition_type',
        parse: value => {
          const type = Object.keys(TRANSITION).find(
            key => TRANSITION[key] === value
          );
          return type === 'NONE' ? 'NO_TRANSITION' : type;
        }
      },
      direction: {
        name: 'direction',
        parse: value =>
          Object.keys(ANIMATION_DIR).find(key => ANIMATION_DIR[key] === value)
      }
    },
    restrict: ['id', 'transitionOrder']
  };

  return mapObject(transition, mapRules);
};
