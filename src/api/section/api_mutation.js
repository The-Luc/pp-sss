import { graphqlRequest } from '../axios';

import { sectionMapping } from '@/common/mapping';

import { SectionDetail } from '@/common/models';

import { addSectionQuery } from './mutations';

/**
 * Add new section
 *
 * @param   {Number | String} bookId  id of selected book
 * @returns {Object}                  detail of new section
 */
export const addNewSection = async bookId => {
  const data = await graphqlRequest(addSectionQuery, {
    bookId,
    params: [
      {
        assigned_user_id: null,
        name: null,
        draggable: null,
        color: null,
        status: null,
        due_date: null,
        order: null
      }
    ]
  });

  return new SectionDetail({ ...sectionMapping(data) });
};
