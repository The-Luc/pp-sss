import { graphqlRequest } from '../urql';

import { sheetMappingToApi } from '@/common/mapping';

import {
  addSheetMutation,
  updateSheetMutation,
  updateSheetOrderMutation,
  deleteSheetMutation,
  moveSheetMutation,
  updateSheetLinkMutation
} from './mutations';
import { isEmpty, isOk } from '@/common/utils';

/**
 * Add new sheet
 *
 * @param   {String}  sectionId id of selected section
 * @param   {Object}  sheet     data of new sheet
 * @param   {String}  lastSheetId  if of inside backcover sheet if adding to last section
 * @returns {Object}            mutation result
 */
export const addNewSheetApi = async (sectionId, sheet, lastSheetId) => {
  const isUpdate = Boolean(lastSheetId);

  return graphqlRequest(addSheetMutation, {
    sectionId,
    createSheetParams: sheetMappingToApi(sheet),
    sheetId: lastSheetId,
    updateSheetParams: { sheet_order: sheet.order + 1 },
    isUpdate
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
 * @param   {String}  sectionId id of selected section
 * @param   {Array}   sheetIds  id of sheets in selection section in new order
 * @returns {Boolean}           success or not
 */
export const updateSheetOrderApi = async (sectionId, sheetIds) => {
  const res = await graphqlRequest(updateSheetOrderMutation, {
    sectionId,
    sheetIds: sheetIds.map(id => parseInt(id))
  });

  return isOk(res);
};

/**
 * Update link status of sheet & page title of page
 *
 * @param   {String}  sheetId     id of selected sheet
 * @param   {Array}   pageIds     id of pages of selected sheet
 * @param   {String}  linkStatus  new data of selected sheet
 * @returns {Promise<Boolean>}             is success
 */
export const updateSheetLinkApi = async (sheetId, pageIds, linkStatus) => {
  const res = await graphqlRequest(updateSheetLinkMutation, {
    sheetId,
    sheetParams: sheetMappingToApi({ link: linkStatus }),
    leftPageId: pageIds[0],
    rightPageId: pageIds[1],
    pageParams: { title: '' }
  });

  return isOk(res);
};

/**
 * Move sheet to other section
 *
 * @param   {String}  sectionId   id of selected section
 * @param   {Number}  targetIndex new order of sections
 * @param   {String}  sheetId     id of moving sheet
 * @param   {Array}  sheetIds     array sheet id of target section
 * @returns {Object}              mutation result
 */
export const moveSheetApi = async (
  sectionId,
  targetIndex,
  sheetId,
  sheetIds
) => {
  const res = await graphqlRequest(moveSheetMutation, {
    sectionId,
    targetIndex,
    sheetId,
    sheetIds: sheetIds.map(Number)
  });

  return isOk(res);
};

/**
 * Delete a sheet
 *
 * @param   {String}  sheetId id of selected sheet
 * @returns {Object}          mutation result
 */
export const deleteSheetApi = async (sheetId, sectionId, sheetIds) => {
  const isUpdateOrder = !isEmpty(sheetIds);

  const res = await graphqlRequest(deleteSheetMutation, {
    sheetId,
    sectionId,
    sheetIds,
    isUpdateOrder
  });

  return isOk(res);
};
