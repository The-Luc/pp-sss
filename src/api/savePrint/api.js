import { isEmpty, isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import {
  addInProjectMutation,
  removeInProjectMutation,
  savePrintDataMutation
} from './mutation';

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

export const updateInProjectApi = async (variables, isAutosave, isDigital) => {
  const { addAssetIds, removeAssetIds } = variables;
  variables.type = isDigital ? 'DIGITAL_FRAME' : 'PAGE';

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
