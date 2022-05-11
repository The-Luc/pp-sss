import { graphqlRequest } from '../urql';

import { createTemplateMappingMutation } from './mutations';

export const createTemplateMappingApi = async params => {
  const res = await graphqlRequest(createTemplateMappingMutation, params);
  console.log(res);
  return res;
};
