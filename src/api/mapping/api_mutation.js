import { graphqlRequest } from '../urql';

import {
  createTemplateMappingMutation,
  deleteTemplateElementMutation,
  updateMappingConfigMutation
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
