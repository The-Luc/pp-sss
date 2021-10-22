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
    restrict: ['sheets']
  };

  return mapObject(section, mapRules);
};
