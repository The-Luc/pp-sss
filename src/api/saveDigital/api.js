import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  saveDigitalConfigMutation,
  saveDigitalObjectsMuataion
} from './mutation';

export const saveDigitalObjectsApi = async variables => {
  const res = await graphqlRequest(saveDigitalObjectsMuataion, variables);

  return isOk(res);
};

export const saveDigitalConfigApi = async variables => {
  const res = await graphqlRequest(saveDigitalConfigMutation, variables);

  return isOk(res);
};
