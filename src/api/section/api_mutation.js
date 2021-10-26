import { graphqlRequest } from '../axios';

import { sectionMapping } from '@/common/mapping';

import { SectionDetail } from '@/common/models';

import {
  addSectionQuery,
  assignSectionUserMutation,
  updateSectionMutation
} from './mutations';

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

/**
 * To update assignee of a section
 *
 * @param {Object} data including sectionId and assigneeId of a section
 * @returns object containing info of assignee
 */
export const assignSectionUser = async (sectionId, assigneeId) => {
  return await graphqlRequest(assignSectionUserMutation, {
    sectionId,
    params: { assigned_user_id: assigneeId }
  });
};

/**
 * Update section
 * @param {String} sectionId section's id
 * @param {Object} params params to update section
 * @returns section data
 */
export const updateSection = async (sectionId, params) => {
  const data = await graphqlRequest(updateSectionMutation, {
    sectionId,
    params
  });
  return new SectionDetail({ ...sectionMapping(data) });
};
