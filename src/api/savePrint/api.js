import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { savePrintDataMutation } from './mutation';

export const savePrintDataApi = async (variables, isAutosave) => {
  variables.noLeftPage = Boolean(!variables.leftId);
  variables.noRightPage = Boolean(!variables.rightId);

  variables.leftId = variables.leftId || '';
  variables.rightId = variables.rightId || '';

  const res = await graphqlRequest(
    savePrintDataMutation,
    variables,
    isAutosave
  );
  return isOk(res);
};
