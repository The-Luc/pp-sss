import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { saveDigitalDataMutation } from './mutation';

export const saveDigitalDataApi = async variables => {
  const res = await graphqlRequest(saveDigitalDataMutation, variables, true);

  return isOk(res);
};
