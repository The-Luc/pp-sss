import { isEmpty, isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  addInProjectMutation,
  removeInProjectMutation,
  savePrintDataMutation,
  savePrintObjectMutation
} from './mutation';

const updatePageIdVariables = variables => {
  variables.noLeftPage = Boolean(!variables.leftId);
  variables.noRightPage = Boolean(!variables.rightId);

  variables.leftId = variables.leftId || '';
  variables.rightId = variables.rightId || '';
};

export const savePrintConfigApi = async variables => {
  updatePageIdVariables(variables);

  const res = await graphqlRequest(savePrintDataMutation, variables);

  return isOk(res);
};

export const savePrintObjectApi = async variables => {
  updatePageIdVariables(variables);

  const res = await graphqlRequest(savePrintObjectMutation, variables);
  return isOk(res);
};

export const updateInProjectApi = async (variables, isDigital) => {
  const { addAssetIds, removeAssetIds } = variables;
  variables.type = isDigital ? 'DIGITAL_FRAME' : 'PAGE';
  variables.projectIdInt = parseInt(variables.projectId);

  if (!variables.projectId) return null;

  const addingPromise = isEmpty(addAssetIds)
    ? []
    : addAssetIds.map(id =>
        graphqlRequest(addInProjectMutation, { ...variables, assetId: id })
      );

  const removingPromise = isEmpty(removeAssetIds)
    ? []
    : removeAssetIds.map(id =>
        graphqlRequest(removeInProjectMutation, { ...variables, assetId: id })
      );

  const res = await Promise.all(addingPromise, removingPromise);
  return isOk(res);
};
