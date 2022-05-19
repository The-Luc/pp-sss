import { graphqlRequest } from '../urql';

import {
  createTemplateMappingMutation,
  updateMappingConfigMutation
} from './mutations';

export const createTemplateMappingApi = params => {
  return graphqlRequest(createTemplateMappingMutation, params);
};

export const updateMappingProjectApi = (bookId, params) => {
  return graphqlRequest(updateMappingConfigMutation, { bookId, params });
};
