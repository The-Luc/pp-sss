import { TRANS_TARGET } from '@/common/constants';
import { transitionMappingToApi } from '@/common/mapping';
import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  updateBookTransitionMutation,
  updateSectionTransitionMutation,
  updateSheetTransitionMutation,
  updateSingleTransitionMutation
} from './mutations';

export const updateTransitionApi = async (id, params, targetType) => {
  const queryOpts = {
    [TRANS_TARGET.SELF]: updateSingleTransitionMutation,
    [TRANS_TARGET.SHEET]: updateSheetTransitionMutation,
    [TRANS_TARGET.SECTION]: updateSectionTransitionMutation,
    [TRANS_TARGET.ALL]: updateBookTransitionMutation
  };
  const query = queryOpts[targetType];
  const newParams = transitionMappingToApi(params);

  const res = await graphqlRequest(query, {
    id,
    params: newParams
  });
  return isOk(res);
};
