import { graphqlRequest } from '../urql';

import { sheetMappingToApi } from '@/common/mapping';

import {
  addSheetMutation,
  updateSheetMutation,
  deleteSheetMutation
} from './mutations';

/**
 * Add new sheet
 *
 * @param   {String}  sectionId id of selected section
 * @param   {Object}  sheet     data of new sheet
 * @returns {Object}            mutation result
 */
export const addNewSheet = async (sectionId, sheet) => {
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
export const updateSheet = async (sheetId, params) => {
  return graphqlRequest(updateSheetMutation, { sheetId, params });
};

/**
 * Delete a sheet
 *
 * @param   {String}  sheetId id of selected sheet
 * @returns {Object}          mutation result
 */
export const deleteSheet = async sheetId => {
  return graphqlRequest(deleteSheetMutation, { sheetId });
};
