import { graphqlRequest } from '../axios';

import { sectionMapping, sectionMappingToApi } from '@/common/mapping';

import { SectionBase } from '@/common/models';

import { addSectionMutation, updateSectionMutation } from './mutations';

/**
 * Add new section
 *
 * @param   {Number | String} bookId  id of selected book
 * @returns {Object}                  detail of new section
 */
export const addNewSection = async (bookId, section) =>
  graphqlRequest(addSectionMutation, {
    bookId,
    params: sectionMappingToApi(section)
  });

/**
 * Update section
 * @param {String} sectionId section's id
 * @param {Object} params params to update section
 * @returns section data
 */
export const updateSection = async (sectionId, params) => {
  const res = await graphqlRequest(updateSectionMutation, {
    sectionId,
    params: sectionMappingToApi(params)
  });
  return new SectionBase({ ...sectionMapping(res.data) });
};
