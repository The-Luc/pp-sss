import { elementMappings, elementMappingToApi } from '@/common/mapping';
import { graphqlRequest } from '../urql';

import { isOk } from '@/common/utils';
import {
  createElementMappingMutation,
  createTemplateMappingMutation,
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

export const createElementMappingApi = params => {
  return graphqlRequest(createElementMappingMutation, { params });
};

export const updateSheetMappingConfigApi = (sheetId, params) => {
  return graphqlRequest(updateSheetMappingConfigMutation, { sheetId, params });
};

export const deleteElementMappingApi = ids => {
  return graphqlRequest(deleteElementMappingMutation, { ids });
};

export const updateElementMappingsApi = async (id, data) => {
  const params = elementMappingToApi(data);

  const res = await graphqlRequest(updateElementMappingMutation, {
    id,
    params
  });

  if (!isOk(res)) return;

  return elementMappings(res.data.update_element_mapping);
};
