import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { savePrintDataMutation } from './mutation';

export const savePrintDataApi = async variables => {
  const res = await graphqlRequest(savePrintDataMutation, variables);
  return isOk(res);
};
