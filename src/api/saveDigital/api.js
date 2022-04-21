import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { saveDigitalDataMutation } from './mutation';

export const saveDigitalDataApi = async (variables, isAutosave) => {
  const res = await graphqlRequest(
    saveDigitalDataMutation,
    variables,
    isAutosave
  );

  return isOk(res);
};
