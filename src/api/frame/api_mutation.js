import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { deleteFrameMutation, updateFrameOrderMutation } from './mutation';

export const deleteFrameApi = async frameId => {
  const res = await graphqlRequest(deleteFrameMutation, { frameId });

  return isOk(res);
};

export const updateFrameOrderApi = async (sheetId, frameOrderIds) => {
  const res = await graphqlRequest(updateFrameOrderMutation, {
    sheetId,
    frameOrderIds
  });

  return isOk(res);
};
