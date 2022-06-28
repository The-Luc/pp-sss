import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  saveDigitalConfigMutation,
  saveDigitalObjectsMuataion
} from './mutation';

export const saveDigitalObjectsApi = async (variables, isAutosave) => {
  const res = await graphqlRequest(
    saveDigitalObjectsMuataion,
    variables,
    isAutosave
  );

  return isOk(res);
};

export const saveDigitalConfigApi = async (variables, isAutosave) => {
  const res = await graphqlRequest(
    saveDigitalConfigMutation,
    variables,
    isAutosave
  );

  return isOk(res);
};
