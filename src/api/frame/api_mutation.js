import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { deleteFrameMutation } from './mutation';

export const deleteFrameApi = async frameId => {
  const res = await graphqlRequest(deleteFrameMutation, { frameId });

  return isOk(res);
};
