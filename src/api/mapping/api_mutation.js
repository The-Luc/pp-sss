import { graphqlRequest } from '../urql';

import {
  createElementMappingMutation,
  createTemplateMappingMutation,
  deleteTemplateElementMutation,
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
