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

export const savePrintConfigApi = async (variables, isAutosave) => {
  updatePageIdVariables(variables);

  const res = await graphqlRequest(
    savePrintDataMutation,
    variables,
    isAutosave
  );

  return isOk(res);
};

export const savePrintObjectApi = async (variables, isAutosave) => {
  updatePageIdVariables(variables);

  const res = await graphqlRequest(
    savePrintObjectMutation,
    variables,
    isAutosave
  );
  return isOk(res);
};

export const updateInProjectApi = async (variables, isAutosave, isDigital) => {
  const { addAssetIds, removeAssetIds } = variables;
  variables.type = isDigital ? 'DIGITAL_FRAME' : 'PAGE';
  variables.projectIdInt = parseInt(variables.projectId);

  if (!variables.projectId) return null;

  const addingPromise = isEmpty(addAssetIds)
    ? []
    : addAssetIds.map(id =>
        graphqlRequest(
          addInProjectMutation,
          { ...variables, assetId: id },
          isAutosave
        )
      );

  const removingPromise = isEmpty(removeAssetIds)
    ? []
    : removeAssetIds.map(id =>
        graphqlRequest(
          removeInProjectMutation,
          { ...variables, assetId: id },
          isAutosave
        )
      );

  const res = await Promise.all(addingPromise, removingPromise);
  return isOk(res);
};
