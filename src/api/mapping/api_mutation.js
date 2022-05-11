import { graphqlRequest } from '../urql';

import { createTemplateMappingMutation } from './mutations';
import { getMappingTemplateQuery } from './queries';
import { isOk } from '@/common/utils';

export const createTemplateMappingApi = async params => {
  const res = await graphqlRequest(createTemplateMappingMutation, params);

  if (!isOk(res)) return;

  // update cache data
  await graphqlRequest(
    getMappingTemplateQuery,
    { id: params.printId },
    false,
    true
  );

  return res;
};
