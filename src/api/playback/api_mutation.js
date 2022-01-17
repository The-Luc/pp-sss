import { OBJECT_TYPE, TRANS_TARGET } from '@/common/constants';
import { transitionMappingToApi } from '@/common/mapping';
import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  updateBookAnimationMutation,
  updateBookTransitionMutation,
  updateSectionAnimationMutation,
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

export const updateAnimationApi = async animation => {
  const { objectType, storeType, animationType, id, setting } = animation;

  const objectTypesOpts = {
    [OBJECT_TYPE.TEXT]: 'TEXT',
    [OBJECT_TYPE.SHAPE]: 'SHAPE',
    [OBJECT_TYPE.CLIP_ART]: 'CLIPART',
    [OBJECT_TYPE.IMAGE]: 'IMAGE',
    [OBJECT_TYPE.VIDEO]: 'VIDEO'
  };

  const type = animationType === 'animationIn' ? 'IN' : 'OUT';

  const query =
    storeType === 'book'
      ? updateBookAnimationMutation
      : updateSectionAnimationMutation;

  const res = await graphqlRequest(query, {
    id,
    params: setting,
    objectType: objectTypesOpts[objectType],
    animationType: type
  });

  return isOk(res);
};
