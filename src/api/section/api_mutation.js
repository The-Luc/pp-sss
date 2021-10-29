import { graphqlRequest } from '../axios';

import { sectionMapping, sectionMappingToApi } from '@/common/mapping';

import { SectionBase } from '@/common/models';

import {
  addSectionMutation,
  updateSectionMutation,
  deleteSectionMutation
} from './mutations';

/**
 * Add new section
 *
 * @param   {String}  bookId  id of selected book
 * @param   {Object}  section data of new section
 * @returns {Object}          mutation result
 */
export const addNewSection = async (bookId, section) =>
  graphqlRequest(addSectionMutation, {
    bookId,
    params: sectionMappingToApi(section)
  });

/**
 * Update section
 *
 * @param   {String}  sectionId id of selected section
 * @param   {Object}  params    new data of selected section
 * @returns                     mutation result
 */
export const updateSection = async (sectionId, params) => {
  const res = await graphqlRequest(updateSectionMutation, {
    sectionId,
    params: sectionMappingToApi(params)
  });
  return new SectionBase({ ...sectionMapping(res.data) });
};

/**
 * Delete a section
 *
 * @param   {String}  sectionId id of selected section
 * @returns {Object}            mutation result
 */
export const deleteSection = async sheetId => {
  return graphqlRequest(deleteSectionMutation, { sheetId });
};
