import { graphqlRequest } from '../urql';

import { createTemplateMappingMutation } from './mutations';

export const createTemplateMappingApi = async params => {
  return graphqlRequest(createTemplateMappingMutation, params);
};
