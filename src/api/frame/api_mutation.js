import { get } from 'lodash';
import { mappingFrameToApi } from '@/common/mapping/frame';
import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  createFrameMutation,
  deleteFrameMutation,
  updateFrameMutation,
  updateFrameOrderMutation
} from './mutation';

export const createFrameApi = async (sheetId, frameParams) => {
  const res = await graphqlRequest(createFrameMutation, {
    sheetId,
    frameParams: mappingFrameToApi(frameParams)
  });

  return get(res, 'data.create_digital_frame', {});
};

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

export const updateFrameApi = async (frameId, frameParams) => {
  const res = await graphqlRequest(updateFrameMutation, {
    frameId,
    frameParams: mappingFrameToApi(frameParams)
  });

  return isOk(res);
};
