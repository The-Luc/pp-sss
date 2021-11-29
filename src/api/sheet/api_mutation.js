import { graphqlRequest } from '../urql';

import { sheetMappingToApi } from '@/common/mapping';

import {
  addSheetMutation,
  updateSheetMutation,
  updateSheetOrderMutation,
  deleteSheetMutation
} from './mutations';
import { isOk } from '@/common/utils';

/**
 * Add new sheet
 *
 * @param   {String}  sectionId id of selected section
 * @param   {Object}  sheet     data of new sheet
 * @returns {Object}            mutation result
 */
export const addNewSheetApi = async (sectionId, sheet) => {
  return graphqlRequest(addSheetMutation, {
    sectionId,
    params: sheetMappingToApi(sheet)
  });
};

/**
 * Update data of sheet
 *
 * @param   {String}  sheetId id of selected sheet
 * @param   {Object}  params  new data of selected sheet
 * @returns {Object}          mutation result
 */
export const updateSheetApi = async (sheetId, params) => {
  return graphqlRequest(updateSheetMutation, {
    sheetId,
    params: sheetMappingToApi(params)
  });
};

/**
 * Update order of sheets in section
 *
 * @param   {String}  bookId      id of current bok
 * @param   {Array}   sectionIds  new order of sections
 * @returns {Object}              mutation result
 */
export const updateSheetOrderApi = async (sectionId, sheetIds) => {
  const res = await graphqlRequest(updateSheetOrderMutation, {
    sectionId,
    sheetIds: sheetIds.map(id => parseInt(id))
  });

  return isOk(res);
};

/**
 * Delete a sheet
 *
 * @param   {String}  sheetId id of selected sheet
 * @returns {Object}          mutation result
 */
export const deleteSheetApi = async sheetId => {
  const res = await graphqlRequest(deleteSheetMutation, { sheetId });

  return isOk(res);
};
