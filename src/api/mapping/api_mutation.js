import { elementMappings, elementMappingToApi } from '@/common/mapping';
import { graphqlRequest } from '../urql';

import { isEmpty, isOk } from '@/common/utils';
import {
  createBulkElementMappingMutation,
  createTemplateMappingMutation,
  createElementMappingMutation,
  deleteElementMappingMutation,
  deleteTemplateElementMutation,
  updateElementMappingMutation,
  updateMappingConfigMutation,
  updateSheetMappingConfigMutation
} from './mutations';

export const createTemplateMappingApi = params => {
  return graphqlRequest(createTemplateMappingMutation, params);
};

export const deleteTemplateMappingApi = ids => {
  return graphqlRequest(deleteTemplateElementMutation, { ids });
};

export const updateMappingProjectApi = (bookId, params) => {
  return graphqlRequest(updateMappingConfigMutation, { bookId, params });
};

/**
 * Create bulk element mapping of sheet
 * @param {string} sheetId
 * @param {string} frameId
 * @param {{print_element_uid: string, digital_element_uid: string}[]} params
 * @returns {Promise}
 */
export const createElementMappingApi = (sheetId, frameId, params) => {
  if (isEmpty(params)) return;

  return graphqlRequest(createBulkElementMappingMutation, {
    sheetId,
    frameId,
    params,
    pageId: ''
  });
};

export const createSingleElementMappingApi = async (
  sheetId,
  frameId,
  printId,
  digitalId,
  mapped
) => {
  const params = {
    sheet_id: sheetId,
    digital_frame_id: frameId,
    page_id: '',
    print_element_uid: printId,
    digital_element_uid: digitalId,
    mapped
  };
  const res = await graphqlRequest(createElementMappingMutation, { params });

  if (!isOk(res)) return;

  return elementMappings(res.data.create_element_mapping);
};

export const updateSheetMappingConfigApi = (sheetId, params) => {
  return graphqlRequest(updateSheetMappingConfigMutation, { sheetId, params });
};

export const deleteElementMappingApi = ids => {
  return graphqlRequest(deleteElementMappingMutation, { ids });
};

export const updateElementMappingsApi = async (id, data) => {
  if (!id) return;

  const params = elementMappingToApi(data);

  const res = await graphqlRequest(updateElementMappingMutation, {
    id,
    params
  });

  if (!isOk(res)) return;

  const mappings = elementMappings(res.data.update_element_mapping);

  if (!mappings?.printElementId && !mappings?.digitalElementId)
    deleteElementMappingApi(mappings.id);

  return mappings;
};
