import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { deleteFrameMutation, updateFrameOrder } from './mutation';

export const deleteFrameApi = async frameId => {
  const res = await graphqlRequest(deleteFrameMutation, { frameId });

  return isOk(res);
};

export const updateFrameOrderApi = async (sheetId, frameOrderIds) => {
  const res = await graphqlRequest(updateFrameOrder, {
    sheetId,
    frameOrderIds
  });

  return isOk(res);
};
