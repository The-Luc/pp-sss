import { mapObject, apiToBaseDate } from '@/common/utils';

import { PROCESS_STATUS } from '@/common/constants';

/**
 * Convert section data from API to data of Section Model
 *
 * @param   {Object}  section section data from API
 * @returns {Object}          section data use by model
 */
export const sectionMapping = section => {
  const mapRules = {
    data: {
      status: {
        name: 'status',
        parse: value => PROCESS_STATUS[value]
      },
      due_date: {
        name: 'dueDate',
        parse: value => apiToBaseDate(value)
      },
      assigned_user: {
        data: {
          id: {
            name: 'assigneeId'
          }
        }
      }
    },
    restrict: ['sheets', 'book']
  };

  return mapObject(section, mapRules);
};

/**
 * Convert section data to data of Api
 *
 * @param   {Object}  section section data use by model
 * @returns {Object}          section data from API
 */
export const sectionMappingToApi = section => {
  const mappingStatus = {
    [PROCESS_STATUS.NOT_STARTED]: 'NOT_STARTED',
    [PROCESS_STATUS.IN_PROCESS]: 'IN_PROCESS',
    [PROCESS_STATUS.COMPLETED]: 'COMPLETED',
    [PROCESS_STATUS.APPROVED]: 'APPROVED'
  };
  const mapRules = {
    data: {
      status: {
        name: 'status',
        parse: value => mappingStatus[value]
      },
      dueDate: {
        name: 'due_date',
        parse: value => new Date(value),
        isForce: true
      },
      assigneeId: {
        name: 'assigned_user_id',
        isForce: true
      },
      order: {
        name: 'section_order'
      }
    },
    restrict: ['id', 'sheets', 'sheetIds']
  };

  return mapObject(section, mapRules);
};
