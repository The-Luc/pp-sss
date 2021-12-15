import { graphqlRequest } from '../urql';

import { sectionMapping, sectionMappingToApi } from '@/common/mapping';

import { SectionBase } from '@/common/models';

import {
  addSectionMutation,
  updateSectionMutation,
  deleteSectionMutation,
  updateSectionOrderMutation
} from './mutations';
import { isOk } from '@/common/utils';

/**
 * Add new section, and update the last section order
 *
 * @param   {String}  bookId  id of selected book
 * @param   {Object}  section data of new section
 * @param   {String}  lastSetionId id of the last section
 * @param   {Object}  lastSectionParams params of the last section
 * @returns {Object}          mutation result
 */
export const addNewSectionApi = async (
  bookId,
  section,
  lastSectionId,
  lastSectionParams
) =>
  graphqlRequest(addSectionMutation, {
    bookId,
    params: sectionMappingToApi(section),
    lastSectionId,
    lastSectionParams: sectionMappingToApi(lastSectionParams)
  });

/**
 * Update section
 *
 * @param   {String}  sectionId id of selected section
 * @param   {Object}  params    new data of selected section
 * @returns                     mutation result
 */
export const updateSectionApi = async (sectionId, params) => {
  const res = await graphqlRequest(updateSectionMutation, {
    sectionId,
    params: sectionMappingToApi(params)
  });

  return new SectionBase({ ...sectionMapping(res.data) });
};

/**
 * Update order of  sections
 *
 * @param   {String}  bookId      id of current bok
 * @param   {Array}   sectionIds  new order of sections
 * @returns {Object}              mutation result
 */
export const updateSectionOrderApi = async (bookId, sectionIds) => {
  const res = await graphqlRequest(updateSectionOrderMutation, {
    bookId,
    sectionIds: sectionIds.map(id => parseInt(id))
  });

  return isOk(res);
};

/**
 * Delete a section
 *
 * @param   {String}  sectionId id of selected section
 * @returns {Object}            mutation result
 */
export const deleteSectionApi = async sectionId => {
  const res = await graphqlRequest(deleteSectionMutation, { sectionId });

  return isOk(res);
};
